import { gql } from 'apollo-server-express'
import { Resolvers } from '../types/graphql'
import knex, { st } from '../db/knex'
import { AuthError } from '../utils/errors/AuthError'
import { NewCatchError } from '../utils/errors/NewCatchError'
import { validatePointCoordinates } from '../utils/validations/coordinates'
import { NewCatchBuilder, CatchUpdateBuilder } from '../types/Catch'
import { RequestError } from '../utils/errors/RequestError'

export const typeDef =  gql`

    type Catch {
        id: Int!,
        user: User!,
        waterbody: Waterbody,
        location: Point,
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
        addCatchMedia(id: Int!, media: [MediaInput]!): CatchMedia
        removeCatchMedia(id: Int!): CatchMedia
        deleteCatch(id: Int!): Catch
    }

    input NewCatch {
        waterbody: ID!
        coordinates: [Float]    
        title: String,          @constraint(maxLength: 100)
        description: String,    @constraint(maxLength: 255)
        species: String         @constraint(maxLength: 100)
        weight: WeightInput
        length: LengthInput
        rig: String             @constraint(maxLength: 255)
        media: [MediaInput]
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
            if(!waterbody) throw new NewCatchError('INVALID_WATERBODY')
            const exists = await dataSources.waterbodies.getWaterbody(waterbody)
            if(!exists) throw new NewCatchError('INVALID_WATERBODY')
            const catchObj: NewCatchBuilder = {
                user: auth,
                waterbody
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
            if(media && media.length > 0){
                
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
            //ensure validity of media
            const res = await knex('catchMedia').insert({ user: auth, catch: id, ...media }).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')
            return res[0];
        },
        removeCatchMedia: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            //Delete from s3
            const res = await knex('catchMedia').where({ id, user: auth }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            return res[0];
        },
        deleteCatch: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')
            const res = await knex('catches').where({ id, user: auth }).del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            return res[0];
        }
    },
    Catch: {
        user: async ({ user: id }) => {
            const res = await knex('users').where({ id })
            return res[0];
        },
        waterbody: async ({ waterbody: id }, _, { dataSources }) => {
            const waterbody = await dataSources.waterbodies.findOneById(id)
            return waterbody;
        }
    }
}