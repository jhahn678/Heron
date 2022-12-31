import { Request } from "express";
import knex from "../../configs/knex";
import { AuthCookie } from "../../types/Auth";
import { IUser } from "../../types/User";
import { comparePasswords } from "../../utils/auth/passwords";
import { createTokenPairOnAuth, REFRESH_TOKEN_MAX_AGE } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

interface LoginRequest {
    identifier: string,
    password: string
}

export const loginUser = asyncWrapper(async (req: Request<{},{},LoginRequest>, res) => {
    const { identifier, password } = req.body;
    let user: IUser | undefined;
    user = await knex('users').where('email', identifier).first()
    if(!user) user = await knex('users').where('username', identifier).first()
    if(!user || !user.password || !(await comparePasswords(password, user.password))){
        throw new AuthError('AUTHENTICATION_FAILED')
    }
    const tokens = await createTokenPairOnAuth({ id: user.id })
    res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { 
        httpOnly: true, 
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE 
    })
    res.status(200).json({ 
        ...tokens,
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username, 
        city: user.city,
        state: user.state,
        bio: user.bio,
        avatar: user.avatar, 
    })
})