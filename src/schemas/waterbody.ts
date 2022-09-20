import { AuthenticationError, gql } from 'apollo-server-express'
import knex, { st } from '../configs/knex'
import { CatchSort, Resolvers, ReviewSort, Sort } from '../types/graphql'
import { IWaterbodyReview } from '../types/Waterbody'
import { UploadError } from '../utils/errors/UploadError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'

export const typeDef =  gql`

    type Waterbody {
        id: Int!
        name: String
        classification: String
        ccode: String
        country: String
        subregion: String
        admin_one: [String]
        admin_two: [String]
        geometries: Geometry
        catches(offset: Int, limit: Int, sort: CatchSort): [Catch]
        total_catches: Int
        total_species: Int
        all_species: [SpeciesCount]
        most_caught_species: String
        locations(offset: Int, limit: Int): [Location]
        total_locations: Int
        media(offset: Int, limit: Int): [WaterbodyMedia]
        total_media: Int
        reviews(offset: Int, limit: Int, sort: ReviewSort): [WaterbodyReview]
        total_reviews: Int
        average_rating: Float
        is_saved: Boolean
        distance: Float
        rank: Float
    }

    type SpeciesCount {
        species: String
        count: Int
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
        toggleSaveWaterbody(id: Int!): Boolean
    }
`

export const resolver: Resolvers = {
    Query: {
        waterbody: async (_, { id }, { auth }) => {
            const query = knex("waterbodies").where("id", id)
            if(auth) query.select("*",
                knex.raw(`(select exists (
                select "user" from saved_waterbodies 
                where "user" = ? and waterbody = ?
                )) as is_saved`,[auth, id]
            ));
            const result = await query.first();
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
                .del()
            if(deleted === 1) return false;

            await knex('savedWaterbodies')
                .insert({ user: auth, waterbody: id })
            return true;
        },
        addWaterbodyMedia: async (_, { id, media }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

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
        catches: async ({ id }, { offset, limit, sort }) => {
            let sortField = 'created_at'
            let sortMethod = 'desc';
            switch(sort){
                case CatchSort.LengthLargest:
                    sortField = 'length'; 
                    sortMethod = 'desc'; break;
                case CatchSort.WeightLargest:
                    sortField = 'weight'; 
                    sortMethod = 'desc'; break;
                case CatchSort.CreatedAtOldest:
                    sortField = 'created_at';
                    sortMethod = 'asc'; break;
                case CatchSort.CreatedAtNewest:
                    sortField = 'created_at';
                    sortMethod = 'desc'; break;
            }
            const catches = await knex('catches')
                .where({ waterbody: id })
                .orderBy(sortField, sortMethod)
                .offset(offset || 0)
                .limit(limit || 4)
            return catches;
        },
        is_saved: async ({ id, is_saved }, _, { auth }) => {
            if(is_saved !== undefined) return is_saved;
            if(!auth) return false;
            const res = await knex('savedWaterbodies').where({ user: auth, waterbody: id })
            if(res.length > 0) return true; return false;
        },
        total_catches: async ({ id }) => {
            const result = await knex('catches').where({ waterbody: id }).count('id')
            const { count } = result[0]
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        total_species: async ({ id }) => {
            const result = await knex('catches')
                .where({ waterbody: id })
                .countDistinct('species')
            const { count } = result[0]
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        all_species: async ({ id }) => {
            const result = await knex('catches')
                .where({ waterbody: id })
                .select('species', knex.raw('count(species)'))
                .groupBy('species')
                .orderByRaw('count desc')
            return result;
        },
        most_caught_species: async ({ id }) => {
            const result = knex('catches')
                .select('species')
                .where({ waterbody: id })
                .groupBy('species')
                .orderByRaw('count(*) desc')
            const res = await result;
            if(res.length === 0) return null;
            return res[0].species;
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
                    sortOrder = 'desc'; break;
                case ReviewSort.RatingHighest:
                    sortField = 'rating';
                    sortOrder = 'asc'; break;
                case ReviewSort.RatingLowest:
                    sortField = 'rating';
                    sortOrder = 'asc'; break;
                case ReviewSort.CreatedAtOldest:
                    sortField = 'created_at';
                    sortOrder = 'asc'; break;
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