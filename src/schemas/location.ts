import { AuthenticationError, gql } from 'apollo-server-express'
import knex, { st } from '../configs/knex'
import { Resolvers } from '../types/graphql'
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

export const typeDef =  gql`

    type Location {
        id: Int!,
        title: String,
        description: String,
        user: User!
        waterbody: Waterbody
        media: [LocationMedia]
        geom: Geometry
    }

    type Query {
        location(id: Int!): Location
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
    }

    input NewLocationPoint {
        title: String
        description: String
        waterbody: Int!
        media: [MediaInput!]
        coordinates: [Float]!
        hexcolor: String
    }

    input NewLocationPolygon {
        title: String
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
        location: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const location = await knex('locations').where({ id, user: auth })
            return location[0];
        }
    },
    Mutation: {
        ///Convert to transaction
        createLocationPoint: async (_, { location  }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { coordinates, waterbody, media, title, description, hexcolor } = location;

            const newLocation: NewLocationObj = { user: auth, waterbody };

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
        ///Convert to transaction
        createLocationPolygon: async (_, { location }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { coordinates, waterbody, media, title, description, hexcolor } = location;

            const newLocation: NewLocationObj = { user: auth, waterbody };

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
        addLocationMedia: async (_, { id, media }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, location: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')
            
            const res = await knex('locationMedia').insert(uploads).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')
            return res;
        },
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
        }
    },
    Location: {
        user: async ({ user }) => {
            const res = await knex('users').where({ id: user })
            return res[0];
        },
        waterbody: async ({ waterbody: id }) => {
            const result = await knex('waterbodies').where({ id }).first()
            return result;
        },
        // media: async ({ id }) => {
        //     if(id)
        //     return (await knex('locationMedia').where({ location: id }))
        // }
    }
}


