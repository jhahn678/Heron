import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import knex from "../../../configs/knex"
import S3Client from "../../../configs/s3"
import { MutationResolvers } from "../../../types/graphql"
import { AuthError } from "../../../utils/errors/AuthError"
import { RequestError } from "../../../utils/errors/RequestError"
const { S3_BUCKET_NAME } = process.env;

export const removeLocationMedia: MutationResolvers['removeLocationMedia'] = async (_, { id }, { auth }) => {
    if(!auth) throw new AuthError('AUTHENTICATION_REQUIRED')

    const [res] = await knex('locationMedia').where({ id, user: auth  }).del('*')
    if(!res) throw new RequestError('DELETE_NOT_FOUND')

    await S3Client.send(new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME!,
        Key: res.key
    }))
    return res;
}