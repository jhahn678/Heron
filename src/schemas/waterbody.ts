import { AuthenticationError, gql } from 'apollo-server-express'
import knex, { st } from '../configs/knex'
import { Resolvers, ReviewSort, Sort, Waterbody } from '../types/graphql'
import { IWaterbody, IWaterbodyReview } from '../types/Waterbody'
import { UploadError } from '../utils/errors/UploadError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'

export const typeDef =  gql`

    type Waterbody {
        id: Int!
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
        reviews(offset: Int, limit: Int, sort: ReviewSort): [WaterbodyReview]
        total_reviews: Int
        average_rating: Float
        distance: Float
        rank: Float
    }

    type Query {
        waterbody(id: Int!): Waterbody
        waterbodies(value: String, classifications: [ClassificationEnum!], adminOne: [AdminOneEnum!], queryLocation: QueryLocation, offset: Int, limit: Int, sort: Sort): [Waterbody]
    }

    enum Sort {
        rank
        distance
    }

    enum ReviewSort {
        CREATED_AT_NEWEST
        CREATED_AT_OLDEST
        RATING_HIGHEST
        RATING_LOWEST
    }

    input QueryLocation {
        latitude: Float!
        longitude: Float!,
        withinMeters: Int!
    }

    type Mutation {
        addWaterbodyMedia(id: Int!, media: [MediaInput!]!): [WaterbodyMedia]
        toggleSaveWaterbody(id: Int!): Int
    }
`

export const resolver: Resolvers = {
    Query: {
        waterbody: async (_, { id }) => {
            const result = await knex('waterbodies')
                .where('id', id)
                .first()
            return result
        },
        waterbodies: async (_, args) => {
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
        toggleSaveWaterbody: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const deleted = await knex('savedWaterbodies')
                .where({ user: auth, waterbody: id })
                .del().returning('waterbody')

            if(deleted.length > 0) return deleted[0].waterbody

            const inserted = await knex('savedWaterbodies')
                .insert({ user: auth, waterbody: id })
                .returning('waterbody')
            
            return inserted[0].waterbody
        },
        // addWaterbodyMedia: async (_, { id, media }, { auth }) => {
        //     if(!auth) throw new AuthenticationError('Authentication Required')

        //     const valid = media.filter(x => validateMediaUrl(x.url))
        //     const uploads = valid.map(x => ({ user: auth, waterbody: id, ...x }))
        //     if(uploads.length === 0) throw new UploadError('INVALID_URL')
            
        //     const res = await knex('waterbodyMedia').insert(uploads).returning('*')
        //     return res;
        // },
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
                .orderBy('created_at', 'desc')
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
                .orderBy('created_at', 'desc')
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
                .orderBy('created_at', 'desc')
                .offset(offset || 0)
                .limit(limit || 1)
            return media;
        },
        total_media: async ({ id }) => {
            const result = await knex('waterbodyMedia').where({ waterbody: id }).count()
            const { count } = result[0]
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        reviews: async ({ id }, { offset, limit, sort }) => {
            let sortField: keyof IWaterbodyReview = 'created_at';
            let sortOrder: 'asc' | 'desc' = 'desc';
            switch(sort){
                case ReviewSort.CreatedAtNewest:
                    sortField = 'created_at';
                    sortOrder = 'desc';
                case ReviewSort.RatingHighest:
                    sortField = 'rating';
                    sortOrder = 'asc';
                case ReviewSort.RatingLowest:
                    sortField = 'rating';
                    sortOrder = 'asc';
                case ReviewSort.CreatedAtOldest:
                    sortField = 'created_at';
                    sortOrder = 'asc';
            }
            const results = await knex('waterbodyReviews')
                .where({ waterbody: id })
                .orderBy(sortField, sortOrder)
                .offset(offset || 0)
                .limit(limit || 10)
            return results
        },
        total_reviews: async ({ id }) => {
            const result = await knex('waterbodyReviews')
                .where({ waterbody: id })
                .count()
            const { count } = result[0];
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        average_rating: async ({ id }) => {
            const result = await knex('waterbodyReviews')
                .where({ waterbody: id })
                .avg('rating')
            return result[0].avg
        }
     }
}