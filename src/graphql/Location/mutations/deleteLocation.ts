import { DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { AuthenticationError } from "apollo-server-core"
import knex from "../../../configs/knex"
import S3Client from "../../../configs/s3"
import { MutationResolvers } from "../../../types/graphql"
import { RequestError } from "../../../utils/errors/RequestError"
const { S3_BUCKET_NAME } = process.env;

export const deleteLocation: MutationResolvers['deleteLocation'] = async (_, { id }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')

    const media = await knex('locationMedia').where({ location: id, user: auth }).del('*')
    const mapImage = await knex('locationMapImages').where({ location: id, user: auth }).del('*')
    const keys = media.concat(mapImage).map(x => ({ Key: x.key }))
    await S3Client.send(new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME!,
        Delete: { Objects: keys }
    }))

    const [res] = await knex('locations').where({ id, user: auth }).del('*')
    if(!res) throw new RequestError('DELETE_NOT_FOUND')
    return res;
}