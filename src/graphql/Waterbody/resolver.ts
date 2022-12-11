import knex from "../../configs/knex";
import { CatchSort, Privacy, Resolvers, ReviewSort } from "../../types/graphql";
import { addWaterbodyMedia } from "./mutations/addWaterbodyMedia";
import { toggleSaveWaterbody } from "./mutations/toggleSaveWaterbody";
import { getWaterbodies } from "./queries/getWaterbodies";
import { getWaterbody } from "./queries/getWaterbody";

export const resolver: Resolvers = {
    Query: {
        waterbody: getWaterbody,
        waterbodies: getWaterbodies
    },
    Mutation: {
        addWaterbodyMedia,
        toggleSaveWaterbody
    },
    Waterbody: {
        geometries: async ({ id }) => {
            const geometries = knex.raw('st_asgeojson(st_collect(st_transform(geom, 4326)))::json')
            const result = await knex('geometries')
                .where('waterbody', id)
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
                .where('waterbody', id)
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
            const [{ count }] = await knex('catches').where('waterbody', id).count('id')
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        total_species: async ({ id }) => {
            const [{ count }] = await knex('catches')
                .whereNotNull('species')
                .andWhere('waterbody', id)
                .countDistinct('species')
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        all_species: async ({ id }) => {
            const result = await knex('catches')
                .whereNotNull('species')
                .andWhere('waterbody', id)
                .select('species', knex.raw(`count(*)`))
                .groupBy('species')
                .orderByRaw('count desc')
            return result;
        },
        most_caught_species: async ({ id }) => {
            const result = knex('catches')
                .select('species')
                .whereNotNull('species')
                .andWhere('waterbody', id)
                .groupBy('species')
                .orderByRaw('count(*) desc')
            const res = await result;
            if(res.length === 0) return null;
            return res[0].species;
        },
        locations: async ({ id }, { offset, limit }) => {
            const locations = await knex('locations')
                .where('waterbody', id)
                .andWhere('privacy', Privacy.Public)
                .orderBy('created_at', 'desc')
                .offset(offset || 0)
                .limit(limit || 4)
            return locations;
        },
        total_locations: async ({ id }) => {
            const [{ count }] = await knex('locations')
                .where('waterbody', id)
                .andWhere('privacy', Privacy.Public)
                .count('id')
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        media: async ({ id }, { offset, limit }) => {
            const media = await knex('waterbodyMedia')
                .where('waterbody', id)
                .orderBy('created_at', 'desc')
                .offset(offset || 0)
                .limit(limit || 1)
            return media;
        },
        total_media: async ({ id }) => {
            const [{ count }] = await knex('waterbodyMedia').where({ waterbody: id }).count()
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        reviews: async ({ id }, { offset, limit, sort }) => {
            const query = knex('waterbodyReviews')
                .where('waterbody', id)
                .offset(offset || 0)
                .limit(limit || 10)
            switch(sort){
                case ReviewSort.CreatedAtNewest:
                    query.orderBy('created_at', 'desc')
                    break;
                case ReviewSort.RatingHighest:
                    query.orderBy('rating', 'desc')
                    break;
                case ReviewSort.RatingLowest:
                    query.orderBy('rating', 'asc')
                    break;
                case ReviewSort.CreatedAtOldest:
                    query.orderBy('created_at', 'asc')
                    break;
                default:
                    query.orderBy('created_at', 'desc')
            }
            const results = await query;
            return results
        },
        total_reviews: async ({ id }) => {
            const [{ count }] = await knex('waterbodyReviews')
                .where('waterbody', id)
                .count()
            if(typeof count !== 'number') return parseInt(count)
            return count
        },
        average_rating: async ({ id }) => {
            const result = await knex('waterbodyReviews')
                .where('waterbody', id)
                .avg('rating')
            return result[0].avg
        },
        rating_counts: async ({ id }) => {
            const ratingCounts = { one: 0, two: 0, three: 0, four: 0, five: 0 };
            const result = await knex('waterbodyReviews')
                .where('waterbody', id)
                .select('rating')
                .count('id')
                .groupBy('rating')
            result.forEach(x => {
                switch(x.rating){
                    case 5:
                        return ratingCounts.five = parseInt(x.count as string);
                    case 4:
                        return ratingCounts.four = parseInt(x.count as string);
                    case 3:
                        return ratingCounts.three = parseInt(x.count as string);
                    case 2:
                        return ratingCounts.two = parseInt(x.count as string);
                    case 1:
                        return ratingCounts.one = parseInt(x.count as string);
                    default:
                        return;
                }
            })
            return ratingCounts;
        }
     }
}