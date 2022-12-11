import { DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { AuthenticationError } from "apollo-server-core"
import knex from "../../../configs/knex"
import S3Client from "../../../configs/s3"
import { MutationResolvers } from "../../../types/graphql"
const { S3_BUCKET_NAME } = process.env;

export const deleteUser: MutationResolvers['deleteUser'] = async (_, __, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const { rows } = await knex.raw<{ rows: { key: string }[] }>(`
        with del1 as (
            delete from user_avatars 
            where "user" = ? returning "key"
        ), del2 as (
            delete from catch_media 
            where "user" = ? returning "key"
        ), del3 as (
            delete from catch_map_images 
            where "user" = ? returning "key"
        ), del4 as (
            delete from location_media 
            where "user" = ? returning "key"
        ), del5 as (
            delete from location_map_images 
            where "user" = ? returning "key"
        ), del6 as (
            delete from waterbody_media 
            where "user" = ? returning "key"
        )
        select "key" from del1
        union all
        select "key" from del2
        union all
        select "key" from del3
        union all
        select "key" from del4
        union all
        select "key" from del5
        union all
        select "key" from del6
    `, new Array(6).fill(auth))
    const keys = rows.map(x => ({ Key: x.key}))
    await S3Client.send(new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME!,
        Delete: { Objects: keys }
    }))
    const [res] = await knex('users').where('id', auth).del('*')
    return res;
}