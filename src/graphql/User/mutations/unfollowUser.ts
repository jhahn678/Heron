import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";

export const unfollowUser:  MutationResolvers['unfollowUser'] = async (_, { id }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    await knex('userFollowers')
        .where({ user: auth, following: id })
        .del()
    return id;
}