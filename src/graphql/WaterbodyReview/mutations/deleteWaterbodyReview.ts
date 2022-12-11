import { AuthenticationError } from "apollo-server-core"
import knex from "../../../configs/knex"
import { MutationResolvers } from "../../../types/graphql"

export const deleteWaterbodyReview: MutationResolvers['deleteWaterbodyReview'] = async (_, { id }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const [result] = await knex('waterbodyReviews')
        .where({ user: auth, id })
        .del('*')
    return result
}