import { gql } from "apollo-server-core";

export const typeDef =  gql`

    type Query {
        media(id: Int!, type: MediaType!): Media
    }

    type Mutation {
        deleteMedia(id: Int!, type: MediaType!): Media
    }

    union Media = CatchMedia | WaterbodyMedia | LocationMedia | AnyMedia

    enum MediaType {
        CATCH
        LOCATION
        WATERBODY
        MAP_CATCH
        MAP_LOCATION
    }

    type AnyMedia {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
    }

    type CatchMedia {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        catch: Catch
    }

    type CatchMapImage {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        catch: Catch
    }

    type LocationMedia  {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        location: Location
    }

    type LocationMapImage {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        location: Location
    }

    type WaterbodyMedia {
        id: Int!
        user: User
        url: String!
        key: String!
        created_at: DateTime!
        waterbody: Waterbody
    }

    input MediaInput {
        url: String!
        key: String!
    }

`