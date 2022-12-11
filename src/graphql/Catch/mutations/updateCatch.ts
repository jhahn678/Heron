import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { AuthenticationError } from "apollo-server-core";
import knex, { st } from "../../../configs/knex";
import S3Client from "../../../configs/s3";
import { CatchUpdateBuilder, ICatch } from "../../../types/Catch";
import { MutationResolvers } from "../../../types/graphql";
import { RequestError } from "../../../utils/errors/RequestError";
import { UploadError } from "../../../utils/errors/UploadError";
import { validateMediaUrl } from "../../../utils/validations/validateMediaUrl";
const { S3_BUCKET_NAME } = process.env;

export const updateCatch: MutationResolvers['updateCatch'] = async (_, { id, details }, { auth }) => {
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
        const [current] = await knex('catchMapImages').where({ user: auth, catch: id }).del('key')
        if(current) await S3Client.send(new DeleteObjectCommand({
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
}