import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";

export const toggleSaveWaterbody: MutationResolvers["toggleSaveWaterbody"] = async (_, { id }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')

    const deleted = await knex('savedWaterbodies')
        .where({ user: auth, waterbody: id })
        .del()
    if(deleted === 1) return false;

    await knex('savedWaterbodies')
        .insert({ user: auth, waterbody: id })
    return true;
}