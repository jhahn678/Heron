import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AuthenticationError, UserInputError } from "apollo-server-core";
import knex from "../../../configs/knex";
import S3Client from "../../../configs/s3";
import { MediaType, MutationResolvers } from "../../../types/graphql";
const { S3_BUCKET_NAME } = process.env;

export const deleteMedia: MutationResolvers['deleteMedia'] = async (_, { id, type }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    let table: string;
    switch(type){
        case MediaType.Catch: table = 'catchMedia'; break;
        case MediaType.Location: table = 'locationMedia'; break;
        case MediaType.Waterbody: table = 'waterbodyMedia'; break;
        case MediaType.MapLocation: table = 'locationMapImages'; break;
        case MediaType.MapCatch: table = 'catchMapImages'; break;
    }
    const [res] = await knex(table).where('id', id).andWhere('user', auth).del('*')
    if(!res) throw new UserInputError(`${id} on media type ${type} does not exist`)
    await S3Client.send(new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME!,
        Key: res.key
    }))
    return res;
}