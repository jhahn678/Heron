import knex from "knex";
import { AuthCookie } from "../../types/Auth";
import { verifyRefreshToken } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

export const clearAuthentication = asyncWrapper(async(req, res) => {
    console.log(req.cookies)
    const refreshToken = req.cookies[AuthCookie.refreshToken];
    if(!refreshToken) throw new AuthError('REFRESH_TOKEN_INVALID')
    res.clearCookie(AuthCookie.refreshToken)
    const { jti } = await verifyRefreshToken(refreshToken)
    await knex('refreshTokens').where({ jwtid: jti }).del()
    res.status(200).json({ message: 'User logged out' })
})
