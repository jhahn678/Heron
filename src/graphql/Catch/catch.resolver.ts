import knex from "../../configs/knex";
import { Resolvers } from "../../types/graphql";
import { addCatchMedia } from "./mutations/addCatchMedia";
import { createCatch } from "./mutations/createCatch";
import { deleteCatch } from "./mutations/deleteCatch";
import { removeCatchMedia } from "./mutations/removeCatchMedia";
import { toggleFavoriteCatch } from "./mutations/toggleFavoriteCatch";
import { updateCatch } from "./mutations/updateCatch";
import { getCatch } from "./queries/getCatch";
import { getCatches } from "./queries/getCatches";

export const resolver: Resolvers = {
    Query: {
        catch: getCatch,
        catches: getCatches
    },
    Mutation: {
        createCatch,
        updateCatch,
        deleteCatch,
        addCatchMedia,
        removeCatchMedia,
        toggleFavoriteCatch
    },
    Catch: {
        user: async ({ user: id }) => {
            const res = await knex('users').where({ id })
            return res[0];
        },
        total_favorites: async ({ id, total_favorites }) => {
            if(total_favorites !== undefined) return total_favorites;
            const [{ count }] = await knex('catchFavorites').where('catch', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count)
        },
        is_favorited: async ({ id, is_favorited }, _, { auth }) => {
            if(is_favorited !== undefined) return is_favorited;
            if(!auth) return false;
            const res = await knex('catchFavorites').where({ catch: id, user: auth })
            if(res.length > 0) return true;
            return false;
        },
        waterbody: async ({ waterbody: id }) => {
            const result = await knex('waterbodies').where({ id }).first()
            return result;
        },
        media: async ({ id }, { limit }) => {
            const result = await knex('catchMedia')
                .where({ catch: id })
                .limit(limit || 20)
            return result;
        },
        map_image: async ({ id, map_image }) => {
            if(map_image) return map_image;
            return (await knex('catchMapImages').where('catch', id).first())
        } 
    }
}