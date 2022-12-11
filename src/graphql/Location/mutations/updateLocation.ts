import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { AuthenticationError } from "apollo-server-core";
import knex, { st } from "../../../configs/knex";
import S3Client from "../../../configs/s3";
import { MutationResolvers } from "../../../types/graphql";
import { ILocation, LocationUpdate } from "../../../types/Location";
import { UploadError } from "../../../utils/errors/UploadError";
import { validateMediaUrl } from "../../../utils/validations/validateMediaUrl";
const { S3_BUCKET_NAME } = process.env;

export const updateLocation: MutationResolvers['updateLocation'] = async (_, { id, location }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const { 
        title, description, privacy, 
        hexcolor, point, polygon, 
        map_image, media, deleteMedia 
    } = location;
    const update: LocationUpdate = {};

    if(title) update['title'] = title;
    if(title === null) update['title'] = null;
    if(description) update['description'] = description;
    if(description === null) update['description'] = null;
    if(privacy) update['privacy'] = privacy;
    if(hexcolor) update['hexcolor'] = hexcolor;
    if(point) update['geom'] = st.transform(st.geomFromGeoJSON(point), 3857)
    if(polygon) update['geom'] = st.transform(st.geomFromGeoJSON(polygon), 3857)

    if(map_image || point === null){
        const current = await knex('locationMapImages')
            .where({ user: auth, location: id })
            .first('key')
        if(current) S3Client.send(new DeleteObjectCommand({
            Bucket: S3_BUCKET_NAME!,
            Key: current.key
        }))
    }

    if(map_image){
        if(!validateMediaUrl(map_image.url)) throw new UploadError('INVALID_URL')
        await knex('locationMapImages')
            .insert({ ...map_image, user: auth, location: id })
            .onConflict('location')
            .merge(['key', 'url', 'created_at'])
    }

    if(media){
        const valid = media.filter(x => validateMediaUrl(x.url))
        const uploads = valid.map(x => ({ user: auth, location: id, ...x }))
        if(uploads.length === 0) throw new UploadError('INVALID_URL')
        await knex('locationMedia').insert(uploads)
    }

    if(deleteMedia){
        const deleted = await knex('locationMedia')
            .whereIn('id', deleteMedia)
            .andWhere({ user: auth, location: id })
            .del('key')
        await S3Client.send(new DeleteObjectsCommand({
            Bucket: S3_BUCKET_NAME!,
            Delete: { Objects: deleted.map(x => ({ Key: x.key })) }
        }))
    }

    const [result] = await knex('locations')
        .where({ id, user: auth })
        .update(update)
        .returning(knex.raw(`*, 
            st_asgeojson(st_transform(geom, 4326))::json as geom,
            (select count(*) from location_favorites where location = ?) as total_favorites
        `,[id])
        ) as ILocation[]

    return result;
}