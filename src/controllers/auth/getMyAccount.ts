import knex from "../../configs/knex";
import { verifyAccessToken } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";
import { RequestError } from "../../utils/errors/RequestError";

export const getMyAccount = asyncWrapper(async (req, res) => {
    const { authorization } = req.headers
    if(!authorization) throw new AuthError('TOKEN_INVALID')
    const token = authorization.split(' ')[1];
    const user = verifyAccessToken(token, { error: 'EXPRESS'})
    const result = await knex('users')
        .where('id', user.id)
        .first('email', 'apple_id', 'facebook_id', 'google_id')
    if(!result) throw new RequestError('REQUEST_FAILED')
    res.status(200).json(result)
})