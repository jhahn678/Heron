import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";
import { WaterbodyReviewUpdate } from "../../../types/Waterbody";

export const editWaterbodyReview: MutationResolvers["editWaterbodyReview"] = async (_, { id, input }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const { rating, text } = input;
    const update: WaterbodyReviewUpdate = {}
    if(rating) update['rating'] = rating;
    if(text) update['text'] = text;
    const [result] = await knex('waterbodyReviews')
        .where({ user: auth, id })
        .update(update)
        .returning('*')
    return result;
}