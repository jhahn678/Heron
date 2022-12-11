import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { QueryResolvers } from "../../../types/graphql";

export const getMe: QueryResolvers['me'] = async (_, __, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Missing')
    const user = await knex('users').where('id', auth).first()
    return user;
}