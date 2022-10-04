import { AuthenticationError, gql } from 'apollo-server-express'
import knex, { st } from '../configs/knex'
import { Resolvers, Privacy, LocationQuery, LocationSort } from '../types/graphql'
import { AuthError } from '../utils/errors/AuthError'
import { UploadError } from '../utils/errors/UploadError'
import { RequestError } from '../utils/errors/RequestError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'
import { ILocation, LocationUpdate, NewLocationObj } from '../types/Location'
import S3Client from '../configs/s3'
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
const { S3_BUCKET_NAME } = process.env;
import { LocationQueryError } from '../utils/errors/LocationQueryError'
import { CreateLocationError } from '../utils/errors/CreateLocationError'

export const typeDef =  gql`

    type Location {
        id: Int!,
        privacy: Privacy!
        title: String,
        description: String,
        user: User!
        waterbody: Waterbody
        nearest_place: String
        media: [LocationMedia]
        geom: Geometry
        hexcolor: String
        created_at: DateTime
        total_favorites: Int
        is_favorited: Boolean
        is_saved: Boolean
    }

    type Query {
        location(id: Int!): Location
        locations(type: LocationQuery!, id: Int, coordinates: Coordinates, limit: Int, offset: Int, sort: LocationSort): [Location]
    }

    type Mutation {
        createLocation(location: NewLocation!): Location
        updateLocation(id: Int!, location: LocationUpdate!): Location
        addLocationMedia(id: Int!, media: [MediaInput!]!): [LocationMedia]
        removeLocationMedia(id: Int!): LocationMedia
        deleteLocation(id: Int!): Location
        toggleFavoriteLocation(id: Int!): Boolean 
        toggleSaveLocation(id: Int!): Boolean
    }

    enum Privacy {
        public
        private
        friends
    }

    enum LocationQuery {
        USER
        USER_SAVED
        WATERBODY
    }

    input Coordinates {
        latitude: Float!
        longitude: Float!
    }

    enum LocationSort {
        CREATED_AT_NEWEST
        CREATED_AT_OLDEST
        MOST_RECOMMENDED
        NEAREST
    }

    input NewLocation {
        title: String
        privacy: Privacy!
        description: String
        waterbody: Int!
        media: [MediaInput!]
        point: Point
        polygon: Polygon
        hexcolor: String
    }

    input LocationUpdate {
        title: String,
        description: String
        privacy: Privacy
        point: Point
        polygon: Polygon
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
                knex.raw(`(
                    select count(*) from location_favorites 
                    where location_favorites.location = ?
                ) as total_favorites`,[id])
              )
              .where("id", id)
              .andWhere("privacy", "=", Privacy.Public);
            if(auth){
                query.orWhere('user', auth)
                query.orWhereRaw(`
                    privacy = 'friends' 
                    and "user" in (
                        select "following" 
                        from user_followers
                        where "user" = ?
                    )
                `,[auth])
                 query.select(
                   knex.raw(`( select exists (
                        select "user" from location_favorites 
                        where "user" = ? and location = ?)
                    ) as is_favorited`,[auth, id]),
                   knex.raw(`( select exists (
                        select "user" from saved_locations 
                        where "user" = ? and location = ?)
                    ) as is_saved`, [auth, id])
                 );
            }else{
                query.select(
                    knex.raw('false as is_favorited'),
                    knex.raw('false as is_saved')
                )
            }
            const location = await query.first()
            return location;
        },
        //needs tested
        locations: async (_, { id, type, coordinates, limit, offset, sort }, { auth }) => {
            if(!id) throw new LocationQueryError('ID_NOT_PROVIDED')
            const query = knex("locations").select(
              "*",
              knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
              knex.raw(`(
                select count(*) 
                from location_favorites 
                where location = ?
            ) as total_favorites`, [id])
            );
            switch(type){
                case LocationQuery.User:
                    query.where('user', id)
                    query.andWhere('privacy', Privacy.Public)
                    if(auth){
                        query.orWhereRaw(`
                            privacy = 'friends' 
                            and "user" in (
                                select "following" 
                                from user_followers
                                where "user" = ?
                            )
                        `,[auth])
                    }
                    break;
                case LocationQuery.UserSaved:
                    query.whereRaw(`"id" in (
                        select "id" from saved_locations where "user" = ?
                    )`,[id])
                    break;
                case LocationQuery.Waterbody:
                    query.where('waterbody', id)
                    query.andWhere('privacy', Privacy.Public)
                    if(auth){
                        query.orWhereRaw(`
                            privacy = 'friends' 
                            and "user" in (
                                select "following" 
                                from user_followers
                                where "user" = ?
                            )
                        `,[auth])
                    }
                    break;
            }
            switch (sort) {
              case LocationSort.CreatedAtNewest:
                query.orderBy("created_at", "desc");
                break;
              case LocationSort.CreatedAtOldest:
                query.orderBy("created_at", "asc");
                break;
              case LocationSort.MostRecommended:
                query.orderByRaw(`(
                    select count(*) from location_favorites where location = ?
                ) desc`, [id])
                break;
              case LocationSort.Nearest:
                if (!coordinates) throw new LocationQueryError("COORDINATES_NOT_PROVIDED");
                const { latitude, longitude } = coordinates;
                const point = st.transform(st.setSRID(st.point(longitude, latitude), 4326),3857);
                query.orderByRaw("geom <-> ?", [point]);
                break;
              default:
                query.orderBy("created_at", "desc");
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
        createLocation: async (_, { location }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const { privacy, waterbody, point, polygon, title, description, hexcolor, media } = location;
            if(!point && !polygon) throw new CreateLocationError('No geometry included')

            const newLocation: NewLocationObj = { user: auth, privacy, waterbody };
            if(title) newLocation['title'] = title
            if(description) newLocation['description'] = description;
            if(hexcolor) newLocation['hexcolor'] = hexcolor;
            if(point) newLocation['geom'] = st.transform(st.geomFromGeoJSON(point), 3857)
            if(polygon) newLocation['geom'] = st.transform(st.geomFromGeoJSON(polygon), 3857)

            const [result] = await knex('locations')
                .insert({
                    ...newLocation,
                    nearest_place: knex.raw(`(
                        select "name" || ', ' || "admin_one"
                        from geoplaces 
                        order by geoplaces.geom <-> ? 
                        limit 1
                    )`,[newLocation['geom']])
                })
                .returning(
                    knex.raw(`*, (st_asgeojson(st_transform(geom, 4326))) as geom`)
                ) as ILocation[]

            if(media){
                const valid = media.filter(x => validateMediaUrl(x.url))
                const uploads = valid.map(x => ({ user: auth, location: result.id, ...x }))
                if(uploads.length === 0) throw new UploadError('INVALID_URL')
                await knex('locationMedia').insert(uploads)
            }
            return { ...result, total_favorites: 0 };
        },
        updateLocation: async (_, { id, location }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const { title, description, privacy, hexcolor, point, polygon } = location;
            const update: LocationUpdate = {};

            if(title) update['title'] = title;
            if(description) update['description'] = description;
            if(privacy) update['privacy'] = privacy;
            if(hexcolor) update['hexcolor'] = hexcolor;
            if(point) update['geom'] = st.transform(st.geomFromGeoJSON(point), 3857)
            if(polygon) update['geom'] = st.transform(st.geomFromGeoJSON(polygon), 3857)

            const [result] = await knex('locations')
                .where({ id, user: auth })
                .update(update)
                .returning(
                    knex.raw(`*, (st_asgeojson(st_transform(geom, 4326))) as geom`)
                ) as ILocation[]

            return { ...result, total_favorites: 0 };
        },
        addLocationMedia: async (_, { id, media }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, location: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')
            
            return (await knex('locationMedia').insert(uploads,'*'))
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
        },
        toggleSaveLocation: async (_, { id }, { auth }) => {
            if (!auth) throw new AuthenticationError("Authentication Required");

            const deleted = await knex('savedLocations')
                .where({ location: id, user: auth })
                .del()
            if(deleted === 1) return false;

            await knex('savedLocations')
                .insert({ user: auth, location: id })
            return true;
        },
    },
    Location: {
        user: async ({ user }) => {
            const [res] = await knex('users').where({ id: user })
            return res;
        },
        total_favorites: async ({ id, total_favorites }) => {
            if(total_favorites !== undefined) return total_favorites;
            const [{ count }] = await knex('locationFavorites').where('location', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count);
        },
        is_saved: async ({ id, is_saved }, _, { auth }) => {
            if(is_saved !== undefined) return is_saved;
            if(!auth) return false;
            const res = await knex('savedLocations').where({ location: id, user: auth })
            if(res.length > 0) return true;
            return false;
        },
        is_favorited: async ({ id, is_favorited }, _, { auth }) => {
            if(is_favorited !== undefined) return is_favorited;
            if(!auth) return false;
            const res = await knex('locationFavorites').where({ location: id, user: auth })
            if(res.length > 0) return true;
            return false;
        },
        waterbody: async ({ waterbody: id }) => {
            return (await knex('waterbodies').where({ id }).first())

        },
        media: async ({ id }) => {
            return (await knex('locationMedia').where({ location: id }))
        }
    }
}


