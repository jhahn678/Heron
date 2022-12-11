import { gql } from "apollo-server-core";

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