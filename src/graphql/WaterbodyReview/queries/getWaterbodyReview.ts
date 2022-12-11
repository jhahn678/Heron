import knex from "../../../configs/knex"
import { QueryResolvers } from "../../../types/graphql"

export const getWaterbodyReview: QueryResolvers['waterbodyReview'] = async (_, { id }) => {
    return (await knex('waterbodyReviews').where('id', id).first())
}