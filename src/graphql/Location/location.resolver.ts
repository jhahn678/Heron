import knex from '../../configs/knex';
import { Resolvers } from '../../types/graphql';
import { addLocationMedia } from './mutations/addLocationMedia';
import { createLocation } from './mutations/createLocation';
import { deleteLocation } from './mutations/deleteLocation';
import { removeLocationMedia } from './mutations/removeLocationMedia';
import { toggleFavoriteLocation } from './mutations/toggleFavoriteLocation';
import { toggleSaveLocation } from './mutations/toggleSaveLocation';
import { updateLocation } from './mutations/updateLocation';
import { getLocation } from './queries/getLocation';
import { getLocations } from './queries/getLocations';

export const resolver: Resolvers = {
    Query: {
        location: getLocation,
        locations: getLocations
    },
    Mutation: {
        createLocation,
        updateLocation,
        deleteLocation,
        addLocationMedia,
        toggleSaveLocation,
        removeLocationMedia,
        toggleFavoriteLocation
    },
    Location: {
        user: async ({ user }) => {
            const [res] = await knex('users').where({ id: user })
            return res;
        },
        total_favorites: async ({ id, total_favorites }) => {
            if(total_favorites !== undefined) return total_favorites;
            const [{ count }] = await knex('locationFavorites').where('location', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count);
        },
        is_saved: async ({ id, is_saved }, _, { auth }) => {
            if(is_saved !== undefined) return is_saved;
            if(!auth) return false;
            const res = await knex('savedLocations').where({ location: id, user: auth })
            if(res.length > 0) return true;
            return false;
        },
        is_favorited: async ({ id, is_favorited }, _, { auth }) => {
            if(is_favorited !== undefined) return is_favorited;
            if(!auth) return false;
            const res = await knex('locationFavorites').where({ location: id, user: auth })
            if(res.length > 0) return true;
            return false;
        },
        waterbody: async ({ waterbody: id }) => {
            return (await knex('waterbodies').where({ id }).first())
        },
        media: async ({ id }) => {
            return (await knex('locationMedia').where({ location: id }))
        },
        map_image: async ({ id, map_image }) => {
            if(map_image) return map_image;
            return (await knex('locationMapImages').where('location', id).first())
        }
    }
}