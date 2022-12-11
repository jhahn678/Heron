import { gql } from "apollo-server-core";

export const typeDef = gql`

    type Waterbody {
        id: Int
        name: String
        classification: String
        ccode: String
        country: String
        subregion: String
        admin_one: [String]
        admin_two: [String]
        geometries: Geometry
        catches(offset: Int, limit: Int, sort: CatchSort): [Catch]
        total_catches: Int
        total_species: Int
        all_species: [SpeciesCount!]
        most_caught_species: String
        locations(offset: Int, limit: Int): [Location]
        total_locations: Int
        media(offset: Int, limit: Int): [WaterbodyMedia]
        total_media: Int
        reviews(offset: Int, limit: Int, sort: ReviewSort): [WaterbodyReview]
        total_reviews: Int
        average_rating: Float
        rating_counts: RatingCounts
        is_saved: Boolean
        distance: Float
        rank: Float
    }

    type SpeciesCount {
        species: String!
        count: Int!
    }

    type RatingCounts {
        five: Int!
        four: Int!
        three: Int!
        two: Int!
        one: Int!
    }

    type Query {
        waterbody(id: Int!): Waterbody
        waterbodies(
            value: String, 
            classifications: [ClassificationEnum!], 
            adminOne: [AdminOneEnum!], 
            queryLocation: QueryLocation, 
            offset: Int, 
            limit: Int, 
            sort: Sort
        ): [Waterbody]
    }

    enum Sort {
        rank
        distance
    }

    enum ReviewSort {
        CREATED_AT_NEWEST
        CREATED_AT_OLDEST
        RATING_HIGHEST
        RATING_LOWEST
    }

    input QueryLocation {
        latitude: Float!
        longitude: Float!,
        withinMeters: Int!
    }

    type Mutation {
        addWaterbodyMedia(id: Int!, media: [MediaInput!]!): [WaterbodyMedia]
        toggleSaveWaterbody(id: Int!): Boolean
    }
`