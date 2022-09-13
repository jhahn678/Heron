import { gql } from 'apollo-server-express'
import { AuthenticationError} from 'apollo-server-core'
import { Resolvers } from '../types/graphql'
import knex, { st } from '../configs/knex'
import { AuthError } from '../utils/errors/AuthError'
import { validatePointCoordinates } from '../utils/validations/coordinates'
import { NewCatchBuilder, CatchUpdateBuilder } from '../types/Catch'
import { RequestError } from '../utils/errors/RequestError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'
import { UploadError } from '../utils/errors/UploadError'
import S3Client from '../configs/s3'
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
const { S3_BUCKET_NAME } = process.env;

export const typeDef =  gql`

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
        media: [CatchMedia]
        created_at: DateTime,
        updated_at: DateTime
    }

    enum CatchSort{
        CREATED_AT_NEWEST
        CREATED_AT_OLDEST
        LENGTH_LARGEST
        WEIGHT_LARGEST
    }

    type Point {
        type: String,
        coordinates: [Float]
    }

    type Query {
        catch(id: Int!): Catch
        catches(ids: [Int]): [Catch]
    }

    type Mutation {
        createCatch(newCatch: NewCatch!): Catch
        updateCatchDetails(id: Int!, details: CatchDetails!): Catch
        updateCatchLocation(id: Int!, coords: [Float]!): Catch
        addCatchMedia(id: Int!, media: [MediaInput!]!): [CatchMedia]
        removeCatchMedia(id: Int!): CatchMedia
        deleteCatch(id: Int!): Catch
    }

    input NewCatch {
        waterbody: Int
        coordinates: [Float]    
        title: String,          @constraint(maxLength: 100)
        description: String,    @constraint(maxLength: 255)
        species: String         @constraint(maxLength: 100)
        weight: Float
        length: Float
        rig: String             @constraint(maxLength: 255)
        media: [MediaInput!]
    }

    input CatchDetails {
        title: String,          @constraint(maxLength: 100)
        description: String,    @constraint(maxLength: 255)
        species: String,        @constraint(maxLength: 100)
        weight: Float,
        length: Float,
        rig: String             @constraint(maxLength: 255)
    }



`

export const resolver: Resolvers = {
    Query: {
        catch: async (_, { id }) => {
            const res = await knex('catches').where({ id })
            return res[0];
        },
        catches: async (_, { ids }) => {
            if(ids && ids.length > 0){//@ts-ignore -- not inferred from if check    
                return (await knex('catches').whereIn('id', ids))     
            }
            return (await knex('catches'))
        }
    },
    Mutation: {
        createCatch: async (_, { newCatch }, { auth }) => {
            const { 
                coordinates, description, waterbody, 
                species, weight, length, media, title, rig 
            } = newCatch;

            if(!auth) throw new AuthenticationError('Authentication Required')
            const catchObj: NewCatchBuilder = { user: auth }

            if(waterbody) catchObj['waterbody'] = waterbody;
            if(title) catchObj['title'] = title;
            if(description) catchObj['description'] = description;
            if(species) catchObj['species'] = species;
            if(rig) catchObj['rig'] = rig;
            if(weight) catchObj['weight'] = weight;
            if(length) catchObj['length'] = length;
            if(coordinates && validatePointCoordinates(coordinates)){
                const [lng, lat] = coordinates;
                catchObj['geom'] = st.setSRID(st.point(lng!, lat!), 4326)
            }
            const res = await knex('catches').insert(catchObj).returning('*')
            if(media){
                const valid = media.filter(x => validateMediaUrl(x.url))
                const uploads = valid.map(x => ({ user: auth, catch: res[0].id, ...x}))
                if(uploads.length === 0) throw new UploadError('INVALID_URL')
                await knex('catchMedia').insert(uploads)
            }
            
            return res[0]
        },
        updateCatchDetails: async (_, { id, details }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { weight, length, ...rest } = details;
            const update: CatchUpdateBuilder = {};

            if(weight) update['weight'] = weight
            if(length) update['length'] = length;

            if(Object.keys(rest).length > 0) Object.assign(update, rest)
            if(Object.keys(update).length === 0) throw new RequestError('REQUEST_UNDEFINED')

            const res = await knex('catches').where({ id }).update(update).returning('*')
            if(res.length === 0) throw new RequestError('TRANSACTION_NOT_FOUND')

            return res[0];
        },
        updateCatchLocation: async (_, { id, coords }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            if(!coords || !validatePointCoordinates(coords)) {
                throw new RequestError('REQUEST_UNDEFINED')
            }

            const [lng, lat] = coords;
            const geom = st.setSRID(st.point(lng!, lat!), 4326)

            const res = await knex('catches').where({ id, user: auth }).update({ geom }).returning('*')
            if(res.length === 0) throw new RequestError('TRANSACTION_NOT_FOUND')

            return res[0];
        },
        addCatchMedia: async (_, { id, media }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, catch: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')

            const res = await knex('catchMedia').insert(uploads).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')

            return res;
        },
        removeCatchMedia: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const res = await knex('catchMedia').where({ id, user: auth }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')

            await S3Client.send(new DeleteObjectCommand({
                Bucket: S3_BUCKET_NAME!,
                Key: res[0].key
            }))
            return res[0];
        },
        deleteCatch: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const res = await knex('catches').where({ id, user: auth }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')

            const media = await knex('catchMedia').where({ id, user: auth }).del().returning('*')
            const keys = media.map(x => ({ Key: x.key}))
            await S3Client.send(new DeleteObjectsCommand({
                Bucket: S3_BUCKET_NAME!,
                Delete: { Objects: keys }
            }))

            return res[0];
        }
    },
    Catch: {
        user: async ({ user: id }) => {
            const res = await knex('users').where({ id })
            return res[0];
        },
        waterbody: async ({ waterbody: id }) => {
            const result = await knex('waterbodies').where({ id }).first()
            return result;
        },
        media: async ({ id }) => {
            const result = await knex('catchMedia').where({ catch: id })
            return result;
        }
    }
}





