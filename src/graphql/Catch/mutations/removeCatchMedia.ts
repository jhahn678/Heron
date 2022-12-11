import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import S3Client from "../../../configs/s3";
import { MutationResolvers } from "../../../types/graphql";
import { RequestError } from "../../../utils/errors/RequestError";
const { S3_BUCKET_NAME } = process.env;

export const removeCatchMedia: MutationResolvers['removeCatchMedia'] = async (_, { id }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')

    const [res] = await knex('catchMedia').where({ id, user: auth }).del('*')
    if(!res) throw new RequestError('DELETE_NOT_FOUND')

    await S3Client.send(new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME!,
        Key: res.key
    }))
    return res;
}
