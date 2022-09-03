import { AuthenticationError, gql } from 'apollo-server-express'
import knex from '../configs/knex'
import { Resolvers } from '../types/graphql'
import { IPendingContact } from '../types/User'
import { RequestError } from '../utils/errors/RequestError'
import { removeUndefined } from '../utils/validations/removeUndefined'

export const typeDef =  gql `
    type User { 
        id: Int!
        firstname: String
        lastname: String
        fullname: String
        username: String!
        avatar: String
        bio: String
        location: String
        contacts: [User]
        total_contacts: Int
        pending_contacts: [PendingContact]
        locations: [Location]
        total_locations: Int
        catches: [Catch]
        total_catches: Int
        saved_waterbodies: [Waterbody]
        created_at: DateTime
        updated_at: DateTime
    }

    type Query {
        me: User
        user(id: Int!): User
        users(ids: [Int]): [User]
    }

    type Mutation {
        updateUserDetails(details: UserDetails!): User
        updateUserAvatar(url: String!): User
        deleteContact(id: Int!): Int
    }

    input UserDetails {
        firstname: String
        lastname: String
        bio: String
        location: String
    }

`




export const resolver: Resolvers = {
    Query: {
        me: async (_, __, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Missing')
            const user = await knex('users').where('id', auth).first()
            return user;
        },
        user: async (_, { id } ) => {
            const user = await knex('users').where('id', id)
            return user[0]
        },
        users: async (_, { ids }) => {
            if(ids && ids.length > 0){ //@ts-ignore -- Not inferring from if check
                const users = await knex('users').whereIn('id', ids)
                return users;
            }
            return (await knex('users'))
        }
    },
    Mutation: {
        updateUserDetails: async (_, { details }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            if(typeof details === undefined) throw new RequestError('REQUEST_UNDEFINED')
            const update = removeUndefined(details)
            const res = await knex('users').where({ id: auth }).update(update).returning('*')
            if(res.length === 0) throw new RequestError('TRANSACTION_NOT_FOUND')
            return res[0];
        },
        updateUserAvatar: async (_, { url }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const res = await knex('users').where({ id: auth }).update({ avatar: url }).returning('*')
            return res[0]; 
        },
        deleteContact: async (_, { id }, { auth }) => {
            if(auth !== id) throw new AuthenticationError('Unauthorized')
            const user_one = id < auth ? id : auth;
            const user_two = id < auth ? auth : id;
            const res = await knex('contacts')
                .where({ user_one, user_two })
                .del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            return id;
        },
    },
    User: {
        fullname: ({ firstname, lastname }) => `${firstname} ${lastname}`,
        contacts: async ({ id }) => {
            const contacts = await knex('contacts')
                .select('users.*')
                .join('users', 'contacts.user_two', '=', 'users.id')
                .where('contacts.user_one', id)
                .unionAll(function(){
                    this.select('users.*')
                    .from('contacts')
                    .join('users', 'contacts.user_one', '=', 'users.id')
                    .where('contacts.user_two', id)
                })
            return contacts;
        },
        locations: async ({ id }, __, { auth }) => {
            if(auth !== id) throw new AuthenticationError('Unauthorized')
            const locations = await knex('locations').where('user', id)
            return locations;
        },
        catches: async ({ id }) => {
            const catches = await knex('catches').where('user', id)
            return catches;
        },
        pending_contacts: async ({ id }, _, { auth }) => {
            if(auth !== id) throw new AuthenticationError('Unauthorized')
            const pending: IPendingContact[] = await knex('pendingContacts')
                .where('user_recipient', id)
                .unionAll(function(){
                    this.select('*').from('pendingContacts').where('user_sending', id)
                })
            return pending;
        },
        total_contacts: async ({ id }) => {
            const res = await knex('contacts').where('user_one', id).orWhere('user_two', id).count()
            const { count } = res[0];
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        total_locations: async ({ id }) => {
            const res = await knex('locations').where('user', id).count()
            const { count } = res[0];
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        total_catches: async ({ id }) => {
            const res = await knex('catches').where('user', id).count()
            const { count } = res[0];
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        saved_waterbodies: async ({ id }) => {
            const res = await knex('savedWaterbodies').where({ user: id })
            const ids = res.map(x => x.waterbody)
            if(ids.length === 0) return [];
            return (await knex('waterbodies').whereIn('id', ids))
        } 
    }
}