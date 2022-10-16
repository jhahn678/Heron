import { gql } from 'apollo-server-express'
import { AuthenticationError} from 'apollo-server-core'
import { CatchQuery, CatchSort, Resolvers } from '../types/graphql'
import knex, { st } from '../configs/knex'
import { NewCatchBuilder, CatchUpdateBuilder, ICatch } from '../types/Catch'
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

export const resolver: Resolvers = {
    Query: {
        catch: async (_, { id }, { auth }) => {
            const query = knex("catches").where({ id }).select("*",
                knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
                knex.raw(`(select count(*) from catch_favorites where catch = ?) as total_favorites`,[id]),
                knex.raw(`(select row_to_json(img) from catch_map_images as img where catch = ?) as map_image`,[id]),
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
        catches: async (_, { id, type, offset, limit, coordinates, within, sort }, { auth }) => {
            const query = knex("catches").select("*",
                knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
                knex.raw(`(select row_to_json(img) from catch_map_images as img where catch = catches.id) as map_image`)
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
                case CatchQuery.Following:
                    if(!auth) throw new AuthenticationError('Not Authenticated')
                    query.whereIn("user", function(){
                        this.select("following")
                            .from('userFollowers')
                            .where('user',auth)
                    })
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
                point, description, waterbody, 
                map_image, species, weight, length,
                media, title, rig, created_at
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
            if(point) catchObj['geom'] = st.transform(st.geomFromGeoJSON(point), 3857)
            if(created_at) catchObj['created_at'] = created_at;

            const [result] = await knex("catches").insert(catchObj, '*')

            if(map_image){
                if(!validateMediaUrl(map_image.url)) throw new UploadError('INVALID_URL')
                await knex('catchMapImages').insert({ ...map_image, user: auth, catch: result.id })
            }
              
            if(media){
                const valid = media.filter(x => validateMediaUrl(x.url))
                const uploads = valid.map(x => ({ user: auth, catch: result.id, ...x}))
                if(uploads.length === 0) throw new UploadError('INVALID_URL')
                await knex('catchMedia').insert(uploads)
            }

            if(!point) return { ...result, total_favorites: 0 };
            return { ...result, geom: point, total_favorites: 0 } 
        },
        // needs tested
        updateCatch: async (_, { id, details }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const { 
                weight, length, description, created_at,
                rig, species, title, waterbody, 
                point, map_image, media, deleteMedia 
            } = details;

            const update: CatchUpdateBuilder = {};

            if(weight) update['weight'] = weight
            if(weight === null) update['weight'] = null;
            if(length) update['length'] = length;
            if(length === null) update['length'] = null;
            if(description) update['description'] = description;
            if(description === null) update['description'] = null;
            if(rig) update['rig'] = rig;
            if(rig === null) update['rig'] = null;
            if(species) update['species'] = species;
            if(species === null) update['species'] = null;
            if(title) update['title'] = title;
            if(title === null) update['title'] = null;
            if(waterbody) update['waterbody'] = waterbody
            if(point) update['geom'] = st.transform(st.geomFromGeoJSON(point), 3857)
            if(point === null) update['geom'] = null;
            if(created_at) update['created_at'] = created_at;

            if(Object.keys(update).length === 0) throw new RequestError('REQUEST_UNDEFINED')

            if(map_image || point === null){
                const current = await knex('catchMapImages').where({ user: auth, catch: id }).first('key')
                if(current) S3Client.send(new DeleteObjectCommand({
                    Bucket: S3_BUCKET_NAME!,
                    Key: current.key
                }))
            }

            if(map_image){
                if(!validateMediaUrl(map_image.url)) throw new UploadError('INVALID_URL')
                await knex('catchMapImages')
                    .insert({ ...map_image, user: auth, catch: id })
                    .onConflict('catch')
                    .merge(['key', 'url', 'created_at'])
            }

            if(media){
                const valid = media.filter(x => validateMediaUrl(x.url))
                const uploads = valid.map(x => ({ user: auth, catch: id, ...x}))
                if(uploads.length === 0) throw new UploadError('INVALID_URL')
                await knex('catchMedia').insert(uploads)
            }

            if(deleteMedia){
                const deleted = await knex('catchMedia')
                    .whereIn('id', deleteMedia)
                    .andWhere({ user: auth, catch: id })
                    .del('key')
                if(deleted.length) await S3Client.send(new DeleteObjectsCommand({
                    Bucket: S3_BUCKET_NAME!,
                    Delete: { Objects: deleted.map(x => ({ Key: x.key })) }
                }))
            }

            const [res] = await knex('catches')
                .where({ id })
                .update(update)
                .returning(
                    knex.raw(`*, (st_asgeojson(st_transform(geom, 4326))) as geom`)
                ) as ICatch[]

            if(!res) throw new RequestError('TRANSACTION_NOT_FOUND')
            return res;
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

            const [res] = await knex('catchMedia').where({ id, user: auth }).del('*')
            if(!res) throw new RequestError('DELETE_NOT_FOUND')

            await S3Client.send(new DeleteObjectCommand({
                Bucket: S3_BUCKET_NAME!,
                Key: res.key
            }))
            return res;
        },
        // needs tested
        deleteCatch: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')

            const media = await knex('catchMedia').where({ catch: id, user: auth }).del('*')
            const mapImage = await knex('catchMapImages').where({ catch: id, user: auth }).del('*')
            const keys = media.concat(mapImage).map(x => ({ Key: x.key }))
            if(keys.length) await S3Client.send(new DeleteObjectsCommand({
                Bucket: S3_BUCKET_NAME!,
                Delete: { Objects: keys }
            }))

            const [res] = await knex('catches').where({ id, user: auth }).del('*')
            if(!res) throw new RequestError('DELETE_NOT_FOUND')

            return res;
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
        total_favorites: async ({ id, total_favorites }) => {
            if(total_favorites !== undefined) return total_favorites;
            const [{ count }] = await knex('catchFavorites').where('catch', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count)
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
        },
        map_image: async ({ id, map_image }) => {
            if(map_image) return map_image;
            return (await knex('catchMapImages').where('catch', id).first())
        } 
    }
}





