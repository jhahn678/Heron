import { gql } from 'apollo-server-express'

export const typeDef =  gql`
    type Waterbody {
        name: String
        states: [String]
        classification: String
        country: String
        counties: [String]
        ccode: String
        subregion: String
        catches: [Catch]
        locations: [Location]
        media: [WaterbodyMedia]
    }

    type Query {
        getWaterbody(id: ID!): Waterbody
        getWaterbodies(ids: [ID]): [Waterbody]
    }

    type Mutation {
        addWaterbodyMedia(media: [MediaInput]!): Waterbody
        bookmarkWaterbody(id: ID!): [Waterbody]
    }
`

export const resolver = {
    Query: {
        getWaterbody: () => {},
        getWaterbodies: () => {}
    },
    Mutation: {
        bookmarkWaterbody: () => {},
        addWaterbodyMedia: () => {}
    },
    Waterbody: {
        catches: () => {},
        locations: () => {},
    }
}