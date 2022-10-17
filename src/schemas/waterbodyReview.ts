import { AuthenticationError, gql } from 'apollo-server-core'
import knex from '../configs/knex' 
import { Resolvers, ReviewSort } from '../types/graphql'
import { IWaterbodyReview, WaterbodyReviewUpdate } from '../types/Waterbody'
import { WaterbodyReviewError } from '../utils/errors/WaterbodyReviewError'

export const typeDef = gql`
    type WaterbodyReview {
        id: Int!
        waterbody: Waterbody
        user: User
        rating: Int!
        text: String
        created_at: DateTime
    }

    type Query {
        waterbodyReview(id: Int!): WaterbodyReview
        waterbodyReviews(id: Int!, offset: Int, limit: Int, sort: ReviewSort): [WaterbodyReview]
    }

    type Mutation {
        addWaterbodyReview(input: NewReviewInput!): WaterbodyReview
        deleteWaterbodyReview(id: Int!): WaterbodyReview
        editWaterbodyReview(id: Int!, input: ReviewUpdate!): WaterbodyReview
    }

    input NewReviewInput {
        waterbody: Int!
        rating: Int!
        text: String!
    }

    input ReviewUpdate {
        rating: Float
        text: String
    }
`

export const resolver: Resolvers = {
    Query: {
        waterbodyReview: async (_, { id }) => {
            return (await knex('waterbodyReviews').where('id', id).first())
        },
        waterbodyReviews: async (_, { id, offset, limit, sort }) => {
            let sortField: keyof IWaterbodyReview = 'created_at';
            let sortOrder: 'asc' | 'desc' = 'desc';
            switch(sort){
                case ReviewSort.CreatedAtNewest:
                    sortField = 'created_at';
                    sortOrder = 'desc'; break;
                case ReviewSort.RatingHighest:
                    sortField = 'rating';
                    sortOrder = 'asc'; break;
                case ReviewSort.RatingLowest:
                    sortField = 'rating';
                    sortOrder = 'asc'; break;
                case ReviewSort.CreatedAtOldest:
                    sortField = 'created_at';
                    sortOrder = 'asc'; break;
            }
            const results = await knex('waterbodyReviews')
                .where({ waterbody: id })
                .orderBy(sortField, sortOrder)
                .offset(offset || 0)
                .limit(limit || 10)
            return results;
        }
    },
    Mutation: {
        addWaterbodyReview: async (_, { input }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const query = knex('waterbodyReviews')
            const { rating, waterbody, text } = input;
            if(rating > 5 || rating < 0) throw new WaterbodyReviewError('Invalid rating provided')
            query.insert({ waterbody, rating, text, user: auth }).returning('*')
            const [result] = await query;
            return result;
        },
        deleteWaterbodyReview: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const [result] = await knex('waterbodyReviews')
                .where({ user: auth, id })
                .del('*')
            return result
        },
        editWaterbodyReview: async (_, { id, input }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const { rating, text } = input;
            const update: WaterbodyReviewUpdate = {}
            if(rating) update['rating'] = rating;
            if(text) update['text'] = text;
            const [result] = await knex('waterbodyReviews')
                .where({ user: auth, id })
                .update(update)
                .returning('*')
            return result;
        }
    },
    WaterbodyReview: {
        //can be optimized by default joining waterbody
        waterbody: async ({ waterbody }) => {
            return (await knex('waterbodies').where({ id: waterbody }).first())
        },
        // //can be optimized by default joining user
        user: async ({ user }) => {
            return (await knex('users').where({ id: user }).first())
        }
    }
}