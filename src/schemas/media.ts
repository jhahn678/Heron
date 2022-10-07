import { gql } from 'apollo-server-express'
import { MediaType, Resolvers } from '../types/graphql'
import knex from '../configs/knex'

export const typeDef =  gql`

    type Query {
        media(id: Int!, type: MediaType!): Media
    }

    union Media = CatchMedia | WaterbodyMedia | LocationMedia | AnyMedia

    enum MediaType {
        CATCH
        LOCATION
        WATERBODY
        MAP_CATCH
        MAP_LOCATION
    }

    type AnyMedia {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
    }

    type CatchMedia {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        catch: Catch
    }

    type CatchMapImage {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        catch: Catch
    }

    type LocationMedia  {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        location: Location
    }

    type LocationMapImage {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        location: Location
    }

    type WaterbodyMedia {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        waterbody: Waterbody
    }

    input MediaInput {
        url: String!
        key: String!
    }

`

export const resolver: Resolvers = {
    Query: {
        media: async (_, { id, type }) => {
            let table;
            switch(type){
                case MediaType.Catch:
                    table = 'catchMedia';
                    break;
                case MediaType.Location:
                    table = 'waterbodyMedia';
                    break;
                case MediaType.Waterbody:
                    table = 'locationMedia'
                    break;
                case MediaType.MapLocation:
                    table = 'locationMapImages'
                    break;
                case MediaType.MapCatch:
                    table = 'catchMapImages'
                    break;
            }
            return (await knex(table).where({ id }).first())
        }
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

    },
    AnyMedia: {
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    }
}