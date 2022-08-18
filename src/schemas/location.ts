import { gql } from 'apollo-server-express'
import knex, { st } from '../db/knex'
import { Resolvers } from '../types/graphql'
import { AuthError } from '../utils/errors/AuthError'
import { RequestError } from '../utils/errors/RequestError'
import { validatePointCoordinates } from '../utils/validations/coordinates'
import { NewLocationObj } from '../types/Location'
import * as turf from '@turf/helpers'

export const typeDef =  gql`
    type Location {
        title: String,
        description: String,
        user: User!
        waterbody: Waterbody
        media: [LocationMedia]
        geojson: Geojson
    }

    type Geojson {
        type: String,
        geometry: Geometry
    }

    union Geometry = Point | Polygon

    type Point {
        type: String!
        coordinates: [Float]!
    }

    type Polygon {
        type: String!
        coordinates: [[Float]]!
    }

    type Query {
        getLocation(id: Int!): Location
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
        waterbody: ID!
        media: [MediaInput]
        coordinates: [Float]!
        hexcolor: String
    }

    input NewLocationPolygon {
        title: String
        description: String
        waterbody: ID!
        media: [MediaInput]
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
        coordinates: [[[Float]]]!
        hexcolor: String
    }

`

export const resolver: Resolvers = {
    Query: {
        getLocation: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            const location = await knex('locations').where({ id, user: auth })
            return location[0];
        }
    },
    Mutation: {
        ///Convert to transaction
        createLocationPoint: async (_, { location  }, { auth, dataSources }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            const { coordinates, waterbody, media, title, description, hexcolor } = location;
            const exists = await dataSources.waterbodies.getWaterbody(waterbody)
            if(!exists) throw new RequestError('INVALID_REFERENCE')
            const newLocation: NewLocationObj = { user: auth, waterbody };
            if(title) newLocation['title'] = title
            if(description) newLocation['description'] = description;
            if(hexcolor) newLocation['hexcolor'] = hexcolor;
            if(!validatePointCoordinates(coordinates)) throw new RequestError('COORDS_INVALID')
            const [lng, lat] = coordinates as [number, number];
            newLocation['geom'] = st.setSRID(st.point(lng, lat), 4326)
            const res = await knex('locations').insert(newLocation).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')
            ////////////////////////////////////////
            //    Need to validate media via s3   //
            ////////////////////////////////////////
            if(media && media.length > 0){
                const allMedia = media.map(m => ({ user: auth, location: res[0].id, ...m }))
                await knex('locationMedia').insert(allMedia)
            }
            return res[0];
        },
        ///Convert to transaction
        createLocationPolygon: async (_, { location }, { auth, dataSources }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            const { coordinates, waterbody, media, title, description, hexcolor } = location;
            const exists = await dataSources.waterbodies.getWaterbody(waterbody)
            if(!exists) throw new RequestError('INVALID_REFERENCE')
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
            ////////////////////////////////////////
            //    Need to validate media via s3   //
            ////////////////////////////////////////
            if(media && media.length > 0){
                const allMedia = media.map(m => ({ user: auth, location: res[0].id, ...m }))
                await knex('locationMedia').insert(allMedia)
            }
            return res[0];
        },
        updateLocationDetails: async (_, { id, details }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
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
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
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
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
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
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            const medias = media.map(x => ({ user: auth, location: id, ...x }))
            const res = await knex('locationMedia').insert(medias).returning('*')
            /////     Need to verify images in s3    /////
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')
            return res;
        },
        removeLocationMedia: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            const res = await knex('locationMedia').where({ id }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            /////     Need to delete image from s3    /////
            return res[0];
        },
        deleteLocation: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            const res = await knex('locations').where({ id, user: auth }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            await knex('locationMedia').where({ location: id }).del()
            /////     Need to delete images from s3    /////
            return res[0]
        }
    },
    Location: {
        user: async ({ user }) => {
            const res = await knex('users').where({ id: user })
            return res[0];
        },
        waterbody: async ({ waterbody }, _, { dataSources}) => {
            return (await dataSources.waterbodies.getWaterbody(waterbody))
        }   
    }
}


