import { gql } from 'apollo-server-express'

export const typeDef =  gql `
    type User { 
        id: ID
        firstName: String
        lastName: String
        fullName: String
        username: String
        avatar: Media
        bio: String
        location: String
        email: String
        phone: Int
        googleId: ID
        facebookId: ID
        password: String
        contacts: [User]
        total_contacts: Int
        pending_contacts: [PendingContact]
        locations: [Location]
        total_locations: Int
        catches: [Catch]
        total_catches: Int
        media: [Media]
        total_media: Int
        createdAt: DateTime
        updatedAt: DateTime
    }

    type Query {
        getUser(id: ID!): User
        getUsers(ids: [ID]): [User]
    }

    type Mutation {
        updateUserDetails(details: UserDetails): User
        updateUserAvatar(media: MediaInput): User
        deleteContact(id: ID!): [User]
    }

    input UserDetails {
        firstName: String,
        lastName: String,
        bio: String,
        location: String
    }

`


export const resolver = {
    Query: {
        getUser: () => {},
        getUsers: () => {}
    },
    Mutation: {
        updateUserDetails: () => {},
        updateUserAvatar: () => {},
        deleteContact: () => {},
    },
    User: {
        fullName: () => {},
        contacts: () => {},
        locations: () => {},
        catches: () => {},
        total_contacts: () => {},
        total_locations: () => {},
        total_catches: () => {}
    }
}