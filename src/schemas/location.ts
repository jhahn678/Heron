import { AuthenticationError, gql } from 'apollo-server-express'
import knex, { st } from '../configs/knex'
import { Resolvers, Privacy, LocationQuery, LocationSort } from '../types/graphql'
import { AuthError } from '../utils/errors/AuthError'
import { UploadError } from '../utils/errors/UploadError'
import { RequestError } from '../utils/errors/RequestError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'
import { validatePointCoordinates } from '../utils/validations/coordinates'
import { NewLocationObj } from '../types/Location'
import S3Client from '../configs/s3'
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
const { S3_BUCKET_NAME } = process.env;
import * as turf from '@turf/helpers'
import { LocationQueryError } from '../utils/errors/LocationQueryError'

export const typeDef =  gql`

    type Location {
        id: Int!,
        privacy: Privacy!
        title: String,
        description: String,
        user: User!
        waterbody: Waterbody
        nearest_geoplace: String
        media: [LocationMedia]
        geom: Geometry
        hexcolor: String
        created_at: DateTime
        total_favorites: Int
        is_favorited: Boolean
    }

    type Query {
        location(id: Int!): Location
        locations(type: LocationQuery!, id: Int, coordinates: Coordinates, limit: Int, offset: Int, sort: LocationSort): [Location]
    }

    type Mutation {
        createLocationPoint(location: NewLocationPoint!): Location
        createLocationPolygon(location: NewLocationPolygon!): Location
        updateLocationDetails(id: Int!, details: LocationDetails!): Location
        updateGeojsonPoint(id: Int!, point: pointUpdate!): Location
        updateGeojsonPolygon(id: Int!, polygon: polygonUpdate!): Location
        addLocationMedia(id: Int!, media: [MediaInput!]!): [LocationMedia]
        removeLocationMedia(id: Int!): LocationMedia
        deleteLocation(id: Int!): Location
        toggleFavoriteLocation(id: Int!): Boolean 
    }

    enum Privacy {
        public
        private
        friends
    }

    enum LocationQuery {
        USER
        WATERBODY
    }

    input Coordinates {
        latitude: Float!
        longitude: Float!
    }

    enum LocationSort {
        CREATED_AT_NEWEST
        CREATED_AT_OLDEST
        NEAREST
    }

    input NewLocationPoint {
        title: String
        privacy: Privacy!
        description: String
        waterbody: Int!
        media: [MediaInput!]
        coordinates: [Float]!
        hexcolor: String
    }

    input NewLocationPolygon {
        title: String
        privacy: Privacy!
        description: String
        waterbody: Int!
        media: [MediaInput!]
        coordinates: [[[Float!]!]!]!
        hexcolor: String
    }

    input LocationDetails {
        title: String,
        description: String
    }

    input pointUpdate {
        coordinates: [Float!]!
        hexcolor: String
    }

    input polygonUpdate {
        coordinates: [[[Float!]!]!]!
        hexcolor: String
    }

`

export const resolver: Resolvers = {
    Query: {
        //needs tested
        location: async (_, { id }, { auth }) => {
            const query = knex("locations")
              .select("*",
                knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
                knex.raw(`(count(*) from location_favorties where location = ?) as total_favorites`, [id])
              )
              .where("id", id)
              .andWhere("privacy", "=", Privacy.Public);
            if(auth){
                query.orWhere('user', auth)
                query.orWhereRaw(`privacy = 'friends' and "user" in (
                    select user_one as "user" from contacts
                    where "user_two" = ?
                    union all
                    select user_two as "user" from contacts
                    where "user_one" = ?
                )`,[auth, auth])
                 query.select(knex.raw(`(
                    select exists(
                        select "user" 
                        from location_favorites 
                        where "user" = ? 
                        and location = ?)
                    ) as is_favorited
                `, [auth, id]))
            }else{
                query.select(knex.raw('false as is_favorited'))
            }
            const location = await query.first()
            return location;
        },
        //needs tested
        locations: async (_, { id, type, coordinates, limit, offset, sort }, { auth }) => {
            if(!id) throw new LocationQueryError('ID_NOT_PROVIDED')
            const query = knex("locations").select("*",
                knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
                knex.raw(`(
                    count(*) from location_favorties 
                    where location = ?
                ) as total_favorites`, [id]),
            );
            switch(type){
                case LocationQuery.User:
                    query.where('user', id)
                    query.andWhere('privacy', Privacy.Public)
                    if(auth){
                        query.orWhereRaw(`privacy = 'friends' and "user" in (
                            select user_one as "user" from contacts
                            where "user_two" = ?
                            union all
                            select user_two as "user" from contacts
                            where "user_one" = ?
                        )`, [auth, auth])
                    }
                    break;
                case LocationQuery.Waterbody:
                    query.where('waterbody', id)
                    query.andWhere('privacy', Privacy.Public)
                    if(auth){
                        //The right way to do this may be to not show friend-only
                        //locations via the waterbody page
                        query.orWhereRaw(`privacy = 'friends' and "user" in (
                            select user_one as "user" from contacts
                            where "user_two" = ?
                            union all
                            select user_two as "user" from contacts
                            where "user_one" = ?
                        )`, [auth, auth])
                    }
                    break
            }
            switch (sort){
                case LocationSort.CreatedAtNewest:
                    query.orderBy('created_at', 'desc')
                    break;
                case LocationSort.CreatedAtOldest:
                    query.orderBy('created_at', 'asc')
                    break;
                case LocationSort.Nearest:
                    if(!coordinates) throw new LocationQueryError('COORDINATES_NOT_PROVIDED')
                    const { latitude, longitude } = coordinates;
                    const point = st.transform(st.setSRID(st.point(longitude, latitude), 4326), 3857)
                    query.orderByRaw('geom <-> ?', [point])
                    break;
                default:
                    query.orderBy('created_at', 'desc')
                    break;
            }
            query.offset(offset || 0)
            query.limit(limit || 20)
            const results = await query;
            return results;
        }
    },
    Mutation: {
        // needs tested
        // Convert to transaction
        createLocationPoint: async (_, { location  }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { privacy, coordinates, waterbody, media, title, description, hexcolor } = location;

            const newLocation: NewLocationObj = { user: auth, privacy, waterbody };

            if(title) newLocation['title'] = title
            if(description) newLocation['description'] = description;
            if(hexcolor) newLocation['hexcolor'] = hexcolor;

            if(!validatePointCoordinates(coordinates)) throw new RequestError('COORDS_INVALID')
            const [lng, lat] = coordinates as [number, number];
            newLocation['geom'] = st.setSRID(st.point(lng, lat), 4326)

            const res = await knex('locations').insert(newLocation).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')

            if(media){
                const valid = media.filter(x => validateMediaUrl(x.url))
                const uploads = valid.map(x => ({ user: auth, location: res[0].id, ...x }))
                if(uploads.length === 0) throw new UploadError('INVALID_URL')
                await knex('locationMedia').insert(uploads)
            }

            return res[0];
        },
        // needs tested
        // Convert to transaction
        createLocationPolygon: async (_, { location }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { privacy, coordinates, waterbody, media, title, description, hexcolor } = location;

            const newLocation: NewLocationObj = { user: auth, privacy, waterbody };

            if(title) newLocation['title'] = title
            if(description) newLocation['description'] = description;
            if(hexcolor) newLocation['hexcolor'] = hexcolor;

            try{    //@ts-ignore
                newLocation['geom'] = st.geomFromGeoJSON(turf.polygon(coordinates).geometry)
            }catch(err){
                throw new RequestError('COORDS_INVALID')
            }

            const res = await knex('locations').insert(newLocation).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')
            
            if(media){
                const valid = media.filter(x => validateMediaUrl(x.url))
                const uploads = valid.map(x => ({ user: auth, location: res[0].id, ...x }))
                if(uploads.length === 0) throw new UploadError('INVALID_URL')
                await knex('locationMedia').insert(uploads)
            }

            return res[0];
        },
        // needs tested
        updateLocationDetails: async (_, { id, details }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { title, description } = details;
            const update: any = {};

            if(!title && !description) throw new RequestError('REQUEST_UNDEFINED')
            if(description) update['description'] = description;
            if(title) update['title'] = title;

            const res = await knex('locations').where({ id, user: auth }).update(update).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')

            return res[0];
        },
        // needs tested
        updateGeojsonPoint: async (_, { id, point }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { coordinates, hexcolor } = point;
            const update: any = {};

            if(hexcolor) update['hexcolor'] = hexcolor
            if(coordinates){
                try{ 
                    update['geom'] = st.geomFromGeoJSON(turf.point(coordinates).geometry)
                }catch(err){
                    throw new RequestError('COORDS_INVALID')
                }
            }

            const res = await knex('locations').where({ id, user: auth }).update(update).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')

            return res[0];
        },
        // needs tested
        updateGeojsonPolygon: async (_, { id, polygon }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { coordinates, hexcolor } = polygon;
            const update: any = {};

            if(hexcolor) update['hexcolor'] = hexcolor
            if(coordinates){
                try{ //@ts-ignore -- try/catch
                    update['geom'] = st.geomFromGeoJSON(turf.polygon(coordinates).geometry)
                }catch(err){
                    throw new RequestError('COORDS_INVALID')
                }
            }

            const res = await knex('locations').where({ id, user: auth }).update(update).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')

            return res[0];
        },
        // needs tested
        addLocationMedia: async (_, { id, media }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, location: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')
            
            const res = await knex('locationMedia').insert(uploads).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')
            return res;
        },
        // needs tested
        removeLocationMedia: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

            const res = await knex('locationMedia').where({ id, user: auth  }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')

            await S3Client.send(new DeleteObjectCommand({
                Bucket: S3_BUCKET_NAME!,
                Key: res[0].key
            }))
            return res[0];
        },
        // needs tested
        deleteLocation: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const res = await knex('locations').where({ id, user: auth }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')

            const media = await knex('locationMedia').where({ location: id, user: auth }).del().returning('*')
            const keys = media.map(x => ({ Key: x.key}))
            await S3Client.send(new DeleteObjectsCommand({
                Bucket: S3_BUCKET_NAME!,
                Delete: { Objects: keys }
            }))

            return res[0]
        },
        toggleFavoriteLocation: async (_, { id }, { auth }) => {
            if (!auth) throw new AuthenticationError("Authentication Required");

            const deleted = await knex('locationFavorites')
                .where({ location: id, user: auth })
                .del()
                
            if(deleted === 1) return false;

            await knex('locationFavorites')
                .insert({ user: auth, location: id })

            return true;
        }
    },
    Location: {
        user: async ({ user }) => {
            const res = await knex('users').where({ id: user })
            return res[0];
        },
        nearest_geoplace: async ({ geom }) => {
            const result = await knex.raw(`
                select "name", "admin_one" from geoplaces where "fcode" = 'PPL'
                order by geom <-> st_transform(st_geomfromgeojson(?), 3857)
                limit 1
            `, [geom])
            return `${result.rows[0].name}, ${result.rows[0].admin_one}`
        },
        waterbody: async ({ waterbody: id }) => {
            const result = await knex('waterbodies').where({ id }).first()
            return result;
        },
        media: async ({ id }) => {
            if(id)
            return (await knex('locationMedia').where({ location: id }))
        }
    }
}


