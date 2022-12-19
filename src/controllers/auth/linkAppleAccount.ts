import { Request } from "express";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

interface ReqBody {
    apple_id: string
}

/** @Middleware authenticateRequest sets user property */
export const linkAppleAccount  = asyncWrapper(async (req: Request<{},{},ReqBody>, res) => {
    const { apple_id } = req.body;
    const user =  await knex('users').where({ apple_id }).first()
    if(user) throw new AuthError('APPLE_ACCOUNT_IN_USE')
    const [updated] = await knex('users').where('id', req.user).update({ apple_id }, '*')
    const { id, firstname, lastname, avatar, username } = updated;
    res.status(200).json({
        id,
        firstname,
        lastname,
        avatar,
        username,
        account_created: false
    })
})