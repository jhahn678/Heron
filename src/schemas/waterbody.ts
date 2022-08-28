import { gql } from 'apollo-server-express'
import knex from '../configs/knex'
import { Resolvers } from '../types/graphql'
import { AuthError } from '../utils/errors/AuthError'
import { RequestError } from '../utils/errors/RequestError'
import { UploadError } from '../utils/errors/UploadError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'

export const typeDef =  gql`
    type Waterbody {
        id: Int
        name: String
        classification: String
        country: String
        admin_one: [String]
        admin_two: [String]
        ccode: String
        subregion: String
        catches: [Catch]
        locations: [Location]
        media: [WaterbodyMedia]
    }

    type Query {
        getWaterbody(id: Int!): Waterbody
        getWaterbodies(ids: [Int], offset: Int, limit: Int): [Waterbody]
    }

    type Mutation {
        addWaterbodyMedia(id: Int!, media: [MediaInput!]!): [WaterbodyMedia]
        saveWaterbody(id: Int!): Int
        unsaveWaterbody(id: Int!): Int
    }
`

export const resolver: Resolvers = {
    Query: {
        getWaterbody: async (_, { id }, { dataSources }) => {
            return (await dataSources.waterbodies.getWaterbody(id))
        },
        getWaterbodies: async (_, { ids, offset, limit }, { dataSources }) => {
            if(ids && ids.length > 0) {
                return (await dataSources.waterbodies.getWaterbodies({ ids }))
            }
            const params = { offset: offset || 0, limit: limit || 20 }
            return (await dataSources.waterbodies.getWaterbodies(params))
        },
    },
    Mutation: {
        saveWaterbody: async (_, { id }, { dataSources, auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

            const waterbody = await dataSources.waterbodies.getWaterbody(id);
            if(!waterbody) throw new RequestError('RESOURCE_NOT_FOUND')

            const res = await knex('savedWaterbodies')
                .insert({ user: auth, waterbody: id })
                .returning('waterbody')
            return res[0].waterbody
        },
        unsaveWaterbody: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

            const res = await knex('savedWaterbodies')
                .where({ user: auth, waterbody: id })
                .del().returning('waterbody')
            return res[0].waterbody
        },
        addWaterbodyMedia: async (_, { id, media }, { auth, dataSources }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

            const waterbody = await dataSources.waterbodies.getWaterbody(id);
            if(!waterbody) throw new RequestError('TRANSACTION_NOT_FOUND')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, waterbody: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')
            
            const res = await knex('waterbodyMedia').insert(uploads).returning('*')
            return res;
        },
    },
    Waterbody: {
        catches: async ({ id }) => {
            const catches = await knex('catches').where({ waterbody: id })
            return catches;
        },
        locations: async ({ id }) => {
            const locations = await knex('locations').where({ waterbody: id })
            return locations;
        },
        media: async ({ id }) => {
            const media = await knex('waterbodyMedia').where({ waterbody: id })
            return media;
        }
    }
}