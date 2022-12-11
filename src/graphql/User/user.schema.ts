import { gql } from "apollo-server-core";

export const typeDef =  gql`
    type User { 
        id: Int!
        firstname: String
        lastname: String
        fullname: String
        username: String!
        avatar: String
        bio: String
        location: String
        city: String
        state: String
        am_following: Boolean!
        follows_me: Boolean!
        following(limit: Int, offset: Int): [User]
        total_following: Int!
        followers(limit: Int, offset: Int): [User]
        total_followers: Int!
        locations(
            date: DateRange, 
            waterbody: [Int!], 
            privacy: [Privacy!],
            limit: Int,
            offset: Int
        ): [Location]
        total_locations: Int!
        location_statistics: LocationStatistics
        saved_locations(limit: Int, offset: Int): [Location]
        total_saved_locations: Int!
        catches(
            date: DateRange, 
            species: [String!], 
            waterbody: [Int!], 
            length: Range, 
            weight: Range,
            limit: Int
            offset: Int
        ): [Catch]
        total_catches: Int!
        catch_statistics: CatchStatistics
        saved_waterbodies(limit: Int, offset: Int): [Waterbody]
        total_saved_waterbodies: Int!
        waterbody_reviews(limit: Int, offset: Int, sort: ReviewSort): [WaterbodyReview]
        total_reviews: Int!
        media(limit: Int, offset: Int): [AnyMedia]
        total_media: Int!
        created_at: DateTime!
        updated_at: DateTime!
    }

    type LocationStatistics {
        total_locations: Int!
        waterbody_counts: [WaterbodyCount!]
    }

    type CatchStatistics {
        total_catches: Int!
        largest_catch: Catch
        total_species: Int!
        top_species: String
        species_counts: [SpeciesCount!]
        total_waterbodies: Int!
        top_waterbody: Waterbody
        waterbody_counts: [WaterbodyCount!]
    }

    type WaterbodyCount {
        waterbody: Waterbody!
        count: Int!
    }

    type Query {
        me: User
        user(id: Int!): User
        activityFeed(limit: Int, offset: Int): [Catch]
    }

    type Mutation {
        updateUserDetails(details: UserDetails!): User
        updateUserAvatar(avatar: MediaInput): String
        followUser(id: Int!): Int
        unfollowUser(id: Int!): Int
        deleteUser: User
    }

    input UserDetails {
        firstname: String
        lastname: String
        bio: String
        city: String
        state: String
    }

    input DateRange{
        min: DateTime
        max: DateTime
    }

    input Range {
        min: PositiveInt
        max: PositiveInt
    }
`