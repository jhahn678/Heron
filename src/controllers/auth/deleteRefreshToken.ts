import knex from "../../configs/knex";
import { Request } from "express";
import { verifyRefreshToken } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

interface RequestBody {
    refreshToken: string
}

export const deleteRefreshToken = asyncWrapper(async(req: Request<{},{},RequestBody>, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken) throw new AuthError('REFRESH_TOKEN_INVALID')
    const { jti } = await verifyRefreshToken(refreshToken)
    await knex('refreshTokens').where({ jwtid: jti }).del()
    res.status(200).json({ message: 'Refresh token deleted' })
})