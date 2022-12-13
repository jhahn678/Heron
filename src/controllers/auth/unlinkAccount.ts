import { Request } from "express"
import knex from "../../configs/knex"
import { LinkedAccount } from "../../types/Auth"
import { asyncWrapper } from "../../utils/errors/asyncWrapper"
import { RequestError } from "../../utils/errors/RequestError"

interface UnlinkUpdate {
    apple_id?: null
    facebook_id?: null
    google_id?: null
}

/** @Middleware authenticateRequest sets user property */
export const unlinkAccount = asyncWrapper(async (req: Request<{},{},{ account: LinkedAccount }>, res) => {
    const { account } = req.body
    const update: UnlinkUpdate = {};
    if(account === LinkedAccount.Apple) update['apple_id'] = null;
    if(account === LinkedAccount.Facebook) update['facebook_id'] = null;
    if(account === LinkedAccount.Google) update['google_id'] = null;
    const result = await knex('users').where('id', req.user).update(update, 'id')
    if(result.length === 0) throw new RequestError('REQUEST_FAILED')
    res.status(200).json({ updated: true })
})