import { gql } from "apollo-server-core";

export const typeDef = gql`

    type Catch {
        id: Int!,
        user: User!,
        waterbody: Waterbody,
        geom: Point,
        title: String,
        description: String,
        species: String,
        length: Float,
        weight: Float,
        rig: String,
        media(limit: Int): [CatchMedia]
        map_image: CatchMapImage
        created_at: DateTime,
        updated_at: DateTime
        total_favorites: Int
        is_favorited: Boolean
    }

    enum CatchSort{
        CREATED_AT_NEWEST
        CREATED_AT_OLDEST
        LENGTH_LARGEST
        WEIGHT_LARGEST
        NEAREST
    }

    type Query {
        catch(id: Int!): Catch
        catches(
            type: CatchQuery!, 
            coordinates: Coordinates, 
            within: Int, 
            id: Int, 
            offset: Int, 
            limit: Int, 
            sort: CatchSort
        ): [Catch]
    }

    type Mutation {
        createCatch(newCatch: NewCatch!): Catch
        updateCatch(id: Int!, details: CatchUpdate!): Catch
        addCatchMedia(id: Int!, media: [MediaInput!]!): [CatchMedia]
        removeCatchMedia(id: Int!): CatchMedia
        deleteCatch(id: Int!): Catch
        toggleFavoriteCatch(id: Int!): Boolean
    }

    enum CatchQuery {
        USER
        WATERBODY
        COORDINATES
        FOLLOWING
    }

    input NewCatch {
        waterbody: Int
        point: Point  
        title: String,          @constraint(maxLength: 100)
        description: String,    @constraint(maxLength: 255)
        species: String         @constraint(maxLength: 100)
        weight: Float
        length: Float
        rig: String             @constraint(maxLength: 255)
        created_at: DateTime
        media: [MediaInput!]
        map_image: MediaInput
    }

    input CatchUpdate {
        title: String,
        description: String,
        waterbody: Int,
        species: String, 
        weight: Float,
        length: Float,
        rig: String,
        point: Point,
        media: [MediaInput!]
        deleteMedia: [Int!]
        map_image: MediaInput
        created_at: DateTime
    }
`