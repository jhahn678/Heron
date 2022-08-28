import { gql } from 'apollo-server-express'

export const typeDef =  gql`
    interface Media {
        id: Int!,
        user: Int!,
        url: String!,
        created_at: DateTime!
    }

    type CatchMedia implements Media {
        id: Int!
        user: Int!
        url: String!
        created_at: DateTime!
        catch: Int!
    }

    type LocationMedia implements Media {
        id: Int!
        user: Int!
        url: String!
        created_at: DateTime!
        location: Int!
    }

    type WaterbodyMedia implements Media {
        id: Int!
        user: Int!
        url: String!
        created_at: DateTime!
        waterbody: Int!
    }

    input MediaInput {
        url: String!
        key: String!
    }

`

export const resolver = {
    Media: {
        //@ts-ignore
        __resolveType: (media) => {
            if(media.catch){
                return 'CatchMedia'
            }
            if(media.waterbody){
                return 'WaterbodyMedia'
            }
            if(media.location){
                return 'LocationMedia'
            }
            return null;
        }
    }
}