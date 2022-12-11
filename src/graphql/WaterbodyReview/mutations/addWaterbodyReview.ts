import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";
import { WaterbodyReviewError } from "../../../utils/errors/WaterbodyReviewError";

export const addWaterbodyReview: MutationResolvers["addWaterbodyReview"] = async (_, { input }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const query = knex('waterbodyReviews')
    const { rating, waterbody, text } = input;
    if(rating > 5 || rating < 0) throw new WaterbodyReviewError('Invalid rating provided')
    query.insert({ waterbody, rating, text, user: auth }).returning('*')
    const [result] = await query;
    return result;
}