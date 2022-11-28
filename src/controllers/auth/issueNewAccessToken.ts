import { Request } from "express";
import knex from "../../configs/knex";
import { AuthCookie } from "../../types/Auth";
import { refreshExistingTokenPair } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

interface NewAccessTokenReq {
    /** Refresh Token */
    token: string
    includeUser: boolean
}

export const issueNewAccessToken = asyncWrapper(async (req: Request<{},{},NewAccessTokenReq>, res) => {
    const { REFRESH_TOKEN } = req.cookies;
    const { token, includeUser } = req.body;
    const { user: id, ...tokens } = await refreshExistingTokenPair(token || REFRESH_TOKEN)
    res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
    if(includeUser){
        const user = await knex('users')
            .select('firstname', 'lastname', 'username', 'avatar')
            .where({ id })
            .first()
        if(!user) throw new AuthError('AUTHENTICATION_FAILED')
        res.status(200).json({ id, ...user, ...tokens })
    }else{
        res.status(200).json({ ...tokens })
    }
})