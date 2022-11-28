import { Request } from "express"
import knex from "../../configs/knex"
import { LinkedAccount } from "../../types/Auth"
import { verifyAccessToken } from "../../utils/auth/token"
import { asyncWrapper } from "../../utils/errors/asyncWrapper"
import { AuthError } from "../../utils/errors/AuthError"
import { RequestError } from "../../utils/errors/RequestError"

interface UnlinkUpdate {
    apple_id?: null
    facebook_id?: null
    google_id?: null
}

export const unlinkAccount = asyncWrapper(async (req: Request<{},{},{ account: LinkedAccount }>, res) => {
    const { account } = req.body
    const { authorization } = req.headers
    if(!authorization) throw new AuthError('AUTHENTICATION_REQUIRED')
    const token = authorization.split(' ')[1]
    const { id } = verifyAccessToken(token, { error: 'EXPRESS' }) 
    const update: UnlinkUpdate = {};
    if(account === LinkedAccount.Apple) update['apple_id'] = null;
    if(account === LinkedAccount.Facebook) update['facebook_id'] = null;
    if(account === LinkedAccount.Google) update['google_id'] = null;
    const result = await knex('users').where('id', id).update(update, 'id')
    if(result.length === 0) throw new RequestError('REQUEST_FAILED')
    res.status(200).json({ updated: true })
})