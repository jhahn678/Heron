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
        waterbodyReviews(id: Int!, offset: Int, limit: Int, sort: ReviewSort): [WaterbodyReview]
    }

    type Mutation {
        addWaterbodyReview(input: NewReviewInput!): WaterbodyReview
        deleteWaterbodyReview(id: Int!): Int
        editWaterbodyReview(input: ReviewUpdate!): WaterbodyReview
    }

    input NewReviewInput {
        waterbody: Int!
        rating: Float!
        text: String!
    }

    input ReviewUpdate {
        id: Int!
        rating: Float
        text: String
    }
`

export const resolver: Resolvers = {
    Query: {
        waterbodyReviews: async (_, { id, offset, limit, sort }) => {
            let sortField: keyof IWaterbodyReview = 'created_at';
            let sortOrder: 'asc' | 'desc' = 'desc';
            switch(sort){
                case ReviewSort.CreatedAtNewest:
                    sortField = 'created_at';
                    sortOrder = 'desc';
                case ReviewSort.RatingHighest:
                    sortField = 'rating';
                    sortOrder = 'asc';
                case ReviewSort.RatingLowest:
                    sortField = 'rating';
                    sortOrder = 'asc';
                case ReviewSort.CreatedAtOldest:
                    sortField = 'created_at';
                    sortOrder = 'asc';
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
            const result = await query;
            return result[0]
        },
        deleteWaterbodyReview: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const result = await knex('waterbodyReviews')
                .where({ user: auth, id })
                .del()
                .returning('*')
            return result[0].id;
        },
        editWaterbodyReview: async (_, { input }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const { id, rating, text } = input;
            const update: Pick<WaterbodyReviewUpdate, 'rating' | 'text'> = {}
            if(rating) update['rating'] = rating;
            if(text) update['text'] = text;
            const result = await knex('waterbodyReviews')
                .where({ user: auth, id })
                .update(update)
                .returning('*')
            return result[0];
        }
    },
    WaterbodyReview: {
        //can be optimized by default joining waterbody
        waterbody: async ({ waterbody }) => {
            const result = await knex('waterbodies').where({ id: waterbody }).first()
            return result;
        },
        // //can be optimized by default joining user
        user: async ({ user }) => {
            const result = await knex('users').where({ id: user }).first()
            return result;
        }
    }
}