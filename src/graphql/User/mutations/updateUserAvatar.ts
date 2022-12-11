import { AuthenticationError } from "apollo-server-core"
import knex from "../../../configs/knex"
import { MutationResolvers } from "../../../types/graphql"
import { RequestError } from "../../../utils/errors/RequestError"
import { UploadError } from "../../../utils/errors/UploadError"
import { validateMediaUrl } from "../../../utils/validations/validateMediaUrl"

export const updateUserAvatar: MutationResolvers['updateUserAvatar'] = async (_, { avatar }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    if(!avatar){
        await knex('userAvatars').where('user', auth).del()
        await knex('users').where('id', auth).update('avatar', null)
        return null;
    }
    if(!validateMediaUrl(avatar.url)) throw new UploadError('INVALID_URL')
    const [{ url }] = await knex('userAvatars')
        .insert({ ...avatar, user: auth })
        .onConflict('user')
        .merge(['key', 'url'])
        .returning('url')
    if(!url) throw new RequestError('TRANSACTION_NOT_FOUND')
    await knex('users').where({ id: auth }).update({ avatar: url })
    return url;
}