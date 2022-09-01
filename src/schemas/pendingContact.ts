import { AuthenticationError, gql } from 'apollo-server-express'
import { Resolvers, Status } from '../types/graphql'
import knex from '../configs/knex'
import { AuthError } from '../utils/errors/AuthError'
import { RequestError } from '../utils/errors/RequestError'


export const typeDef = gql`
    type PendingContact {
        user: User!
        status: Status
        sent_at: DateTime
    }

    enum Status {
        TO
        FROM
    }

    type Mutation {
        createPendingContact(id: Int!): PendingContact
        deletePendingContact(id: Int!): PendingContact
        acceptPendingContact(id: Int!): PendingContact
        rejectPendingContact(id: Int!): PendingContact
    }

    input PendingContactInput {
        user: ID!
    }
`

export const resolver: Resolvers = {
    Mutation: {
        /** @TODO Need to test error handling on contact request that was already sent by user */
        createPendingContact: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            //user_one is always stored as the lesser ID
            const user_one = id < auth ? id : auth;
            const user_two = id < auth ? auth : id
            const contact = await knex('contacts').where({ user_one, user_two}).first()
            if(contact) throw new RequestError('DUPLICATE_CONTACT')
            const pending = await knex('pendingContacts')
                .where({ user_recipient: auth, user_sending: id })
            if(pending.length !== 0) throw new RequestError('DUPLICATE_CONTACT_REQUEST')
            const result = await knex('pendingContacts')
                .insert({ user_sending: auth, user_recipient: id })
                .returning('*')
            return result[0];
        },
        deletePendingContact: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const res = await knex('pendingContacts')
                .where({ user_sending: auth, user_recipient: id })
                .del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            return res[0];
        },
        acceptPendingContact: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const res = await knex('pendingContacts')
                .where({ user_recipient: auth, user_sending: id })
                .del().returning('*')
            if(res.length === 0) throw new RequestError('TRANSACTION_NOT_FOUND')
            const user_one = auth > id ? id : auth;
            const user_two = auth > id ? auth : id;
            await knex('contacts').insert({ user_one, user_two })
            return res[0];
        },
        rejectPendingContact: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const res = await knex('pendingContacts')
                .where({ user_recipient: auth, user_sending: id })
                .del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            return res[0];
        }
    },
    PendingContact: {
        user: async ({ user_recipient, user_sending }, _, { auth }) => {
            const id = user_recipient === auth ? user_sending : user_recipient;
            const res = await knex('users').where('id', id)
            return res[0];
        },
        status: ({ user_recipient }, _, { auth }) => {
            return user_recipient === auth ? Status.From : Status.To
        }
    }
}