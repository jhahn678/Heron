import knex from "../../../configs/knex"
import { QueryResolvers } from "../../../types/graphql"

export const getUser: QueryResolvers['user'] = async (_, { id } ) => {
    const user = await knex('users').where('id', id)
    return user[0]
}