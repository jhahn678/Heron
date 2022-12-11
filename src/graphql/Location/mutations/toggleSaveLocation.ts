import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";

export const toggleSaveLocation: MutationResolvers['toggleSaveLocation'] = async (_, { id }, { auth }) => {
    if (!auth) throw new AuthenticationError("Authentication Required");

    const deleted = await knex('savedLocations')
        .where({ location: id, user: auth })
        .del()
    if(deleted === 1) return false;

    await knex('savedLocations')
        .insert({ user: auth, location: id })
    return true;
}