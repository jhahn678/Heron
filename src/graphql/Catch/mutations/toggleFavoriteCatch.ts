import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";

export const toggleFavoriteCatch: MutationResolvers['toggleFavoriteCatch'] = async (_, { id }, { auth }) => {
    if (!auth) throw new AuthenticationError("Authentication Required");

    const deleted = await knex("catchFavorites")
        .where({ catch: id, user: auth })
        .del();
    if (deleted === 1) return false;

    await knex("catchFavorites")
        .insert({ user: auth, catch: id })
    return true;
}