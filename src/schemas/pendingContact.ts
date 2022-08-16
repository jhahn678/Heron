import { gql } from 'apollo-server-express'


export const typeDef = gql`
    type PendingContact {
        user: User!
        status: Status
        createdAt: DateTime
    }

    enum Status {
        TO
        FROM
    }

    type Mutation {
        createPendingContact(id: ID!): [PendingContact]
        deletePendingContact(id: ID!): [PendingContact]
        acceptPendingContact(id: ID!): [PendingContact]
        rejectPendingContact(id: ID!): [PendingContact]
    }

    input PendingContactInput {
        user: ID!
    }
`

export const resolver = {
    Mutation: {
        createPendingContact: () => {},
        deletePendingContact: () => {},
        acceptPendingContact: () => {},
        rejectPendingContact: () => {}
    },
    PendingContact: {
        user: () => {},
    }
}