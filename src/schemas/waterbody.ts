import { AuthenticationError, gql } from 'apollo-server-express'
import knex, { st } from '../configs/knex'
import { Resolvers, Sort } from '../types/graphql'
import { RequestError } from '../utils/errors/RequestError'
import { UploadError } from '../utils/errors/UploadError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'

export const typeDef =  gql`

    type Waterbody {
        id: Int
        name: String
        classification: String
        country: String
        admin_one: [String]
        admin_two: [String]
        ccode: String
        subregion: String
        geometries: Geometry
        catches(offset: Int, limit: Int): [Catch]
        total_catches: Int
        locations(offset: Int, limit: Int): [Location]
        total_locations: Int
        media(offset: Int, limit: Int): [WaterbodyMedia]
        total_media: Int
        distance: Float
        rank: Float
    }

    type Query {
        getWaterbody(id: Int!): Waterbody
        getWaterbodies(value: String, classifications: [ClassificationEnum!], adminOne: [AdminOneEnum!], queryLocation: QueryLocation, offset: Int, limit: Int, sort: Sort): [Waterbody]
    }

    enum Sort {
        rank
        distance
    }

    input QueryLocation {
        latitude: Float!
        longitude: Float!,
        withinMeters: Int!
    }

    type Mutation {
        addWaterbodyMedia(id: Int!, media: [MediaInput!]!): [WaterbodyMedia]
        saveWaterbody(id: Int!): Int
        unsaveWaterbody(id: Int!): Int
    }
`

export const resolver: Resolvers = {
    Query: {
        getWaterbody: async (_, { id }) => {
            const result = await knex('waterbodies')
                .where('id', id)
                .first()
            return result
        },
        getWaterbodies: async (_, args) => {
            const { value, classifications, adminOne, queryLocation, offset, limit, sort } = args;
            const query = knex('waterbodies')
            if(value) query.whereILike('name', (value+'%'))
            if(classifications) query.whereIn('classification', classifications)
            if(adminOne) query.whereRaw(`admin_one && array[${adminOne.map(() => '?').join(',')}]::varchar[]`, adminOne)
            if(queryLocation) {
                const { latitude, longitude, withinMeters } = queryLocation;
                const point = st.transform(st.setSRID(st.point(longitude, latitude), 4326), 3857)
                query.select('id', 'name', 'classification', 'country', 'ccode', 
                    'admin_one', 'admin_two', 'subregion', 'weight', 'oid', 
                    knex.raw('simplified_geometries <-> ? as distance', point), 
                    knex.raw('rank_result(simplified_geometries <-> ?, weight, ?) as rank', [point, withinMeters])
                )
                query.where(st.dwithin('simplified_geometries', point, withinMeters, false))
                if(sort === Sort.Distance){
                    query.orderBy('distance', 'asc')
                }else{
                    query.orderBy('rank', 'desc')
                }
            }
            query.offset(offset || 0)
            query.limit(limit || 20)
            const results = await query
            return results
        },
    },
    Mutation: {
        saveWaterbody: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const waterbody = await knex('waterbodies').where({ id }).first()
            if(!waterbody) throw new RequestError('RESOURCE_NOT_FOUND')

            const res = await knex('savedWaterbodies')
                .insert({ user: auth, waterbody: id })
                .returning('waterbody')
            return res[0].waterbody
        },
        unsaveWaterbody: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const res = await knex('savedWaterbodies')
                .where({ user: auth, waterbody: id })
                .del().returning('waterbody')
            return res[0].waterbody
        },
        addWaterbodyMedia: async (_, { id, media }, { auth, dataSources }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const waterbody = await knex('waterbodies').where({ id }).first()
            if(!waterbody) throw new RequestError('TRANSACTION_NOT_FOUND')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, waterbody: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')
            
            const res = await knex('waterbodyMedia').insert(uploads).returning('*')
            return res;
        },
    },
    Waterbody: {
        geometries: async ({ id: waterbody }) => {
            const geometries = knex.raw('st_asgeojson(st_collect(st_transform(geom, 4326)))::json')
            const result = await knex('geometries')
                .where({ waterbody })
                .select({ geometries })
                .first()
            if(result) return result.geometries;
        },
        catches: async ({ id }, { offset, limit }) => {
            const catches = await knex('catches')
                .where({ waterbody: id })
                .offset(offset || 0)
                .limit(limit || 4)
            return catches;
        },
        total_catches: async ({ id }) => {
            const result = await knex('catches').where({ waterbody: id }).count('id')
            const { count } = result[0]
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        locations: async ({ id }, { offset, limit }) => {
            const locations = await knex('locations')
                .where({ waterbody: id })
                .offset(offset || 0)
                .limit(limit || 4)
            return locations;
        },
        total_locations: async ({ id }) => {
            const result = await knex('locations').where({ waterbody: id }).count('id')
            const { count } = result[0]
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        media: async ({ id }, { offset, limit }) => {
            const media = await knex('waterbodyMedia')
                .where({ waterbody: id })
                .offset(offset || 0)
                .limit(limit || 1)
            return media;
        },
        total_media: async ({ id }) => {
            const result = await knex('waterbodyMedia').where({ waterbody: id }).count()
            const { count } = result[0]
            if(typeof count !== 'number') return parseInt(count)
            return count
        }
     }
}