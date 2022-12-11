import { gql } from "apollo-server-core";

export const typeDef = gql`

    type Location {
        id: Int!,
        privacy: Privacy!
        title: String,
        description: String,
        user: User!
        waterbody: Waterbody
        nearest_place: String
        media: [LocationMedia]
        map_image: LocationMapImage
        geom: Geometry
        hexcolor: String
        created_at: DateTime
        total_favorites: Int
        is_favorited: Boolean
        is_saved: Boolean
    }

    type Query {
        location(id: Int!): Location
        locations(
            id: Int, 
            type: LocationQuery!, 
            coordinates: Coordinates, 
            limit: Int, 
            offset: Int, 
            sort: LocationSort
        ): [Location]
    }

    type Mutation {
        createLocation(location: NewLocation!): Location
        updateLocation(id: Int!, location: LocationUpdate!): Location
        addLocationMedia(id: Int!, media: [MediaInput!]!): [LocationMedia]
        removeLocationMedia(id: Int!): LocationMedia
        deleteLocation(id: Int!): Location
        toggleFavoriteLocation(id: Int!): Boolean 
        toggleSaveLocation(id: Int!): Boolean
    }

    enum Privacy {
        PUBLIC
        PRIVATE
        FRIENDS
    }

    enum LocationQuery {
        USER
        USER_SAVED
        WATERBODY
    }

    input Coordinates {
        latitude: Float!
        longitude: Float!
    }

    enum LocationSort {
        CREATED_AT_NEWEST
        CREATED_AT_OLDEST
        MOST_RECOMMENDED
        NEAREST
    }

    input NewLocation {
        title: String
        privacy: Privacy!
        description: String
        waterbody: Int!
        media: [MediaInput!]
        map_image: MediaInput
        point: Point
        polygon: Polygon
        hexcolor: String
    }

    input LocationUpdate {
        title: String,
        description: String
        privacy: Privacy
        point: Point
        polygon: Polygon
        map_image: MediaInput
        hexcolor: String
        media: [MediaInput!]
        deleteMedia: [Int!]
    }

`