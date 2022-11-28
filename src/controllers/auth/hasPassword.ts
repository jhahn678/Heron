import knex from "../../configs/knex";
import { verifyAccessToken } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

export const hasPassword = asyncWrapper(async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) throw new AuthError('AUTHENTICATION_REQUIRED')
    const token = authorization.split(' ')[1]
    const { id } = verifyAccessToken(token, { error: 'EXPRESS' }) 
    const user = await knex('users').where('id', id).first('password')
    if(!user) throw new AuthError('ACCESS_TOKEN_INVALID')
    res.status(200).json({ hasPassword: Boolean(user.password) })
})



