import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

export const hasPassword = asyncWrapper(async (req, res) => {
    const user = await knex('users').where('id', req.user).first('password')
    if(!user) throw new AuthError('ACCESS_TOKEN_INVALID')
    res.status(200).json({ hasPassword: Boolean(user.password) })
})



