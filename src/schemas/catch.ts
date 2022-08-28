import { gql } from 'apollo-server-express'
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
        length_unit: LengthUnit
        weight: Float,
        weight_unit: WeightUnit,
        rig: String,
        media: [CatchMedia]
        created_at: DateTime,
        updated_at: DateTime
    }

    enum LengthUnit{
        IN
        CM
    }
    
    enum WeightUnit {
        LB
        OZ
        KG
        G
    }

    type Point {
        type: String,
        coordinates: [Float]
    }

    type Query {
        getCatch(id: Int!): Catch
        getCatches(ids: [Int]): [Catch]
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
        weight: WeightInput
        length: LengthInput
        rig: String             @constraint(maxLength: 255)
        media: [MediaInput!]
    }

    input LengthInput {
        value: Float!,
        unit: LengthUnit!
    }

    input WeightInput {
        value: Float!,
        unit: WeightUnit!
    }

    input CatchDetails {
        title: String,          @constraint(maxLength: 100)
        description: String,    @constraint(maxLength: 255)
        species: String,        @constraint(maxLength: 100)
        weight: WeightInput,
        length: LengthInput,
        rig: String             @constraint(maxLength: 255)
    }



`

export const resolver: Resolvers = {
    Query: {
        getCatch: async (_, { id }) => {
            const res = await knex('catches').where({ id })
            return res[0];
        },
        getCatches: async (_, { ids }) => {
            if(ids && ids.length > 0){//@ts-ignore -- not inferred from if check    
                return (await knex('catches').whereIn('id', ids))     
            }
            return (await knex('catches'))
        }
    },
    Mutation: {
        createCatch: async (_, { newCatch }, { auth, dataSources }) => {
            const { 
                coordinates, description, waterbody, 
                species, weight, length, media, title, rig 
            } = newCatch;

            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED');
            const catchObj: NewCatchBuilder = { user: auth }

            if(waterbody){
                const exists = await dataSources.waterbodies.getWaterbody(waterbody)
                if(!exists) throw new RequestError('RESOURCE_NOT_FOUND')
                catchObj['waterbody'] = waterbody;
            }

            if(title) catchObj['title'] = title;
            if(description) catchObj['description'] = description;
            if(species) catchObj['species'] = species;
            if(rig) catchObj['rig'] = rig;
            if(weight) {
                catchObj['weight'] = weight.value;
                catchObj['weight_unit'] = weight.unit;
            }
            if(length){
                catchObj['length'] = length.value;
                catchObj['length_unit'] = length.unit;
            }
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
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

            const { weight, length, ...rest } = details;
            const update: CatchUpdateBuilder = {};

            if(weight){
                update['weight'] = weight.value;
                update['weight_unit'] = weight.unit;
            }
            if(length){
                update['length'] = length.value;
                update['length_unit'] = length.unit;
            }

            if(Object.keys(rest).length > 0) Object.assign(update, rest)
            if(Object.keys(update).length === 0) throw new RequestError('REQUEST_UNDEFINED')

            const res = await knex('catches').where({ id }).update(update).returning('*')
            if(res.length === 0) throw new RequestError('TRANSACTION_NOT_FOUND')

            return res[0];
        },
        updateCatchLocation: async (_, { id, coords }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
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
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, catch: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')

            const res = await knex('catchMedia').insert(uploads).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')

            return res;
        },
        removeCatchMedia: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

            const res = await knex('catchMedia').where({ id, user: auth }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')

            await S3Client.send(new DeleteObjectCommand({
                Bucket: S3_BUCKET_NAME!,
                Key: res[0].key
            }))
            return res[0];
        },
        deleteCatch: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

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
        waterbody: async ({ waterbody: id }, _, { dataSources }) => {
            const waterbody = await dataSources.waterbodies.getWaterbody(id)
            return waterbody;
        },
        media: async ({ id }) => {
            return (await knex('catchMedia').where({ id }))
        }
    }
}





