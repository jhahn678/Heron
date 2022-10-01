import { gql } from 'apollo-server-express'
import { AuthenticationError} from 'apollo-server-core'
import { CatchQuery, CatchSort, Resolvers } from '../types/graphql'
import knex, { st } from '../configs/knex'
import { validatePointCoordinates } from '../utils/validations/coordinates'
import { NewCatchBuilder, CatchUpdateBuilder } from '../types/Catch'
import { RequestError } from '../utils/errors/RequestError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'
import { UploadError } from '../utils/errors/UploadError'
import S3Client from '../configs/s3'
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { CatchQueryError } from '../utils/errors/CatchQueryError'
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
        media(limit: Int): [CatchMedia]
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

    type Point {
        type: String,
        coordinates: [Float!]
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
        updateCatchDetails(id: Int!, details: CatchDetails!): Catch
        updateCatchLocation(id: Int!, coords: [Float]!): Catch
        addCatchMedia(id: Int!, media: [MediaInput!]!): [CatchMedia]
        removeCatchMedia(id: Int!): CatchMedia
        deleteCatch(id: Int!): Catch
        toggleFavoriteCatch(id: Int!): Boolean
    }

    enum CatchQuery {
        USER
        WATERBODY
        COORDINATES
    }

    input NewCatch {
        waterbody: Int
        coordinates: [Float!]    
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
        catch: async (_, { id }, { auth }) => {
            const query = knex("catches")
                .where({ id })
                .select("*",
                    knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
                    knex.raw(`(select count(*) from catch_favorites where catch = ?) as total_favorites`,[id])
                )
            if(auth){
                query.select(knex.raw(`(select exists (
                    select "user" from catch_favorites where "user" = ? and catch = ?
                )) as is_favorited`,[auth, id]));
            }else{
                query.select(knex.raw('false as is_favorited'))
            }

            const result = await query.first();
            return result;
        },
        //needs tested
        catches: async (_, { id, type, offset, limit, coordinates, within, sort }) => {
            const query = knex("catches").select(
              "*",
              knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
            );
            switch(type){
                case CatchQuery.User:
                    if(!id) throw new CatchQueryError('ID_NOT_PROVIDED');
                    query.where('user', id); 
                    break;
                case CatchQuery.Waterbody:
                    if(!id) throw new CatchQueryError('ID_NOT_PROVIDED');
                    query.where('waterbody', id); 
                    break;
                case CatchQuery.Coordinates:
                    if(!coordinates) throw new CatchQueryError('COORDINATES_NOT_PROVIDED')
                    break;
            }
            switch(sort){
                case(CatchSort.CreatedAtNewest):
                    query.orderBy('created_at', 'desc')
                    break;
                case(CatchSort.CreatedAtOldest):
                    query.orderBy('created_at', 'asc')
                    break;
                case(CatchSort.LengthLargest):
                    query.orderBy('length', 'desc')
                    break;
                case(CatchSort.WeightLargest):
                    query.orderBy('weight', 'desc')
                    break;
                case(CatchSort.Nearest):
                    if(!coordinates) throw new CatchQueryError('COORDINATES_NOT_PROVIDED')
                    const { latitude, longitude } = coordinates;
                    const point = st.transform(st.setSRID(st.point(longitude, latitude),4326),3857);
                    if(within) query.where(st.dwithin('geom', point, within, false))
                    query.orderByRaw('geom <-> ?', [point])
                    break;
                default:
                    query.orderBy('created_at', 'desc')
            }
            query.offset(offset || 0)
            query.limit(limit || 20)
            const result = await query;
            return result;
        }
    },
    Mutation: {
        // needs tested
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
                catchObj['geom'] = st.transform(st.setSRID(st.point(lng!, lat!), 4326), 3857)
            }
            const res = await knex("catches")
              .insert(catchObj)
              .returning('*');
              
            if(media){
                const valid = media.filter(x => validateMediaUrl(x.url))
                const uploads = valid.map(x => ({ user: auth, catch: res[0].id, ...x}))
                if(uploads.length === 0) throw new UploadError('INVALID_URL')
                await knex('catchMedia').insert(uploads)
            }

            const result = { ...res[0], total_favorites: 0 };
            if(coordinates) result.geom = { type: "Point", coordinates }
            return result;
        },
        // needs tested
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
        // needs tested
        updateCatchLocation: async (_, { id, coords }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            if(!coords || !validatePointCoordinates(coords)) {
                throw new RequestError('REQUEST_UNDEFINED')
            }

            const [lng, lat] = coords;
            const geom = st.transform(st.setSRID(st.point(lng!, lat!), 4326),3857)

            const res = await knex('catches').where({ id, user: auth }).update({ geom }).returning('*')
            if(res.length === 0) throw new RequestError('TRANSACTION_NOT_FOUND')

            return res[0];
        },
        // needs tested
        addCatchMedia: async (_, { id, media }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const valid = media.filter(x => validateMediaUrl(x.url))
            const uploads = valid.map(x => ({ user: auth, catch: id, ...x }))
            if(uploads.length === 0) throw new UploadError('INVALID_URL')

            const res = await knex('catchMedia').insert(uploads).returning('*')
            if(res.length === 0) throw new RequestError('REQUEST_FAILED')

            return res;
        },
        // needs tested
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
        // needs tested
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
        },
        toggleFavoriteCatch: async (_, { id }, { auth }) => {
            if (!auth) throw new AuthenticationError("Authentication Required");

            const deleted = await knex("catchFavorites")
              .where({ catch: id, user: auth })
              .del();
            if (deleted === 1) return false;

            await knex("catchFavorites")
                .insert({ user: auth, catch: id })
            return true;
        }
    },
    Catch: {
        user: async ({ user: id }) => {
            const res = await knex('users').where({ id })
            return res[0];
        },
        is_favorited: async ({ id, is_favorited }, _, { auth }) => {
            if(is_favorited !== undefined) return is_favorited;
            if(!auth) return false;
            const res = await knex('catchFavorites').where({ catch: id, user: auth })
            if(res.length > 0) return true;
            return false;
        },
        waterbody: async ({ waterbody: id }) => {
            const result = await knex('waterbodies').where({ id }).first()
            return result;
        },
        media: async ({ id }, { limit }) => {
            const result = await knex('catchMedia')
                .where({ catch: id })
                .limit(limit || 20)
            return result;
        }
    }
}





