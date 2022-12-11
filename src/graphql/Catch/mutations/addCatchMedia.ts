import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql"
import { RequestError } from "../../../utils/errors/RequestError";
import { UploadError } from "../../../utils/errors/UploadError";
import { validateMediaUrl } from "../../../utils/validations/validateMediaUrl";

export const addCatchMedia: MutationResolvers['addCatchMedia'] = async (_, { id, media }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')

    const valid = media.filter(x => validateMediaUrl(x.url))
    const uploads = valid.map(x => ({ user: auth, catch: id, ...x }))
    if(uploads.length === 0) throw new UploadError('INVALID_URL')

    const res = await knex('catchMedia').insert(uploads).returning('*')
    if(res.length === 0) throw new RequestError('REQUEST_FAILED')

    return res;
}