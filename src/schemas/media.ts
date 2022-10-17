import { AuthenticationError, gql, UserInputError } from 'apollo-server-express'
import { MediaType, Resolvers } from '../types/graphql'
import knex from '../configs/knex'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import S3Client from '../configs/s3'
const { S3_BUCKET_NAME } = process.env;

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

export const resolver: Resolvers = {
    Query: {
        media: async (_, { id, type }) => {
            let table;
            switch(type){
                case MediaType.Catch:
                    table = 'catchMedia';
                    break;
                case MediaType.Location:
                    table = 'locationMedia';
                    break;
                case MediaType.Waterbody:
                    table = 'waterbodyMedia';
                    break;
                case MediaType.MapLocation:
                    table = 'locationMapImages'
                    break;
                case MediaType.MapCatch:
                    table = 'catchMapImages'
                    break;
            }
            return (await knex(table).where({ id }).first())
        }
    },
    Mutation: {
        deleteMedia: async (_, { id, type }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            let table: string;
            switch(type){
                case MediaType.Catch: table = 'catchMedia'; break;
                case MediaType.Location: table = 'locationMedia'; break;
                case MediaType.Waterbody: table = 'waterbodyMedia'; break;
                case MediaType.MapLocation: table = 'locationMapImages'; break;
                case MediaType.MapCatch: table = 'catchMapImages'; break;
            }
            const [res] = await knex(table).where('id', id).andWhere('user', auth).del('*')
            if(!res) throw new UserInputError(`${id} on media type ${type} does not exist`)
            await S3Client.send(new DeleteObjectCommand({
                Bucket: S3_BUCKET_NAME!,
                Key: res.key
            }))
            return res;
        }
    },
    Media: {
        __resolveType: (media: any) => {
            if(media.hasOwnProperty('catch')) return 'CatchMedia'
            if(media.hasOwnProperty('location')) return 'LocationMedia'
            if(media.hasOwnProperty('waterbody')) return 'WaterbodyMedia'
            return 'AnyMedia'
        }
    },
    CatchMedia: {
        catch: async ({ catch: catchId }) => {
            return (await knex('catches').where('id', catchId).first())
        },
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    CatchMapImage: {
        catch: async ({ catch: catchId }) => {
            return (await knex('catches').where('id', catchId).first())
        },
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    WaterbodyMedia: {
        waterbody: async ({ waterbody }) => {
            return (await knex('waterbodies').where('id', waterbody).first())
        },
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    LocationMedia: {
        location: async ({ location }) => {
            return (await knex('locations').where('id', location).first())
        },  
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    LocationMapImage: {
        location: async ({ location }) => {
            return (await knex('locations').where('id', location).first())
        },  
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    },
    AnyMedia: {
        user: async ({ user }) => {
            return (await knex('users').where('id', user).first())
        }
    }
}