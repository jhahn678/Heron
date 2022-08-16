import { gql } from 'apollo-server-express'

export const typeDef =  gql`
    type Media {
        id: ID,
        user: ID,
        url: String,
        uploadedAt: DateTime
    }

    input MediaInput {
        id: ID
        url: String
        user: ID
        uploadedAt: DateTime
    }

`