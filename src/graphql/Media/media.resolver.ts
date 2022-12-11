import knex from "../../configs/knex"
import { Resolvers } from "../../types/graphql"
import { deleteMedia } from "./mutations/deleteMedia"
import { getMedia } from "./queries/getMedia"

export const resolver: Resolvers = {
    Query: {
        media: getMedia
    },
    Mutation: {
        deleteMedia
    },
    Media: {
        __resolveType: (media: any) => {
            if(media.hasOwnProperty('catch')) return 'CatchMedia'
            if(media.hasOwnProperty('location')) return 'LocationMedia'
            if(media.hasOwnProperty('waterbody')) return 'WaterbodyMedia'
            return 'AnyMedia'
        }
    },
    CatchMedia: {
        catch: async ({ catch: catchId }) => {
            return (await knex('catches').where('id', catchId).first())
        },
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    CatchMapImage: {
        catch: async ({ catch: catchId }) => {
            return (await knex('catches').where('id', catchId).first())
        },
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    WaterbodyMedia: {
        waterbody: async ({ waterbody }) => {
            return (await knex('waterbodies').where('id', waterbody).first())
        },
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    LocationMedia: {
        location: async ({ location }) => {
            return (await knex('locations').where('id', location).first())
        },  
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    LocationMapImage: {
        location: async ({ location }) => {
            return (await knex('locations').where('id', location).first())
        },  
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    AnyMedia: {
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    }
}