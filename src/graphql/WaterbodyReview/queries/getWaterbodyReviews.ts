import knex from "../../../configs/knex";
import { QueryResolvers, ReviewSort } from "../../../types/graphql";
import { IWaterbodyReview } from "../../../types/Waterbody";

export const getWaterbodyReviews: QueryResolvers['waterbodyReviews'] = async (_, { id, offset, limit, sort }) => {
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
    return results;
}