import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";

export const followUser:  MutationResolvers['followUser'] = async (_, { id }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    await knex('userFollowers')
        .insert({ user: auth, following: id })
        .onConflict(['user', 'following'])
        .ignore()
    return id;
}