import { asyncWrapper } from "../utils/errors/asyncWrapper"
import * as crypto from 'crypto'
import knex from "../configs/knex"
import { hashPassword, comparePasswords } from '../utils/auth/passwords'
import { AuthError } from "../utils/errors/AuthError"
import Joi from "joi"
import { Request } from 'express'
import { 
    refreshExistingTokenPair, 
    createTokenPairOnAuth, 
    verifyRefreshToken 
} from "../utils/auth/token"
import { sendPasswordResetEmail } from "../utils/email/resetPasswordEmailConfig"
import redis from "../configs/redis"


interface LoginRequest {
    identifier: string | number,
    password: string
}


export const loginUser = asyncWrapper(async (req: Request<{},{},LoginRequest>, res, next) => {
    const { identifier, password } = req.body;
    if(typeof identifier === 'string' && identifier.includes('@' && '.')){
        const user = await knex('users').where('email', identifier.toLowerCase()).first()
        if(!user || !(await comparePasswords(password, user.password))){
            throw new AuthError('AUTHENTICATION_FAILED')
        }
        const { accessToken, refreshToken } = await createTokenPairOnAuth({ id: user.id }) 
        res.status(200).json({ 
            accessToken,
            refreshToken, 
            id: user.id,
            firstname: user.firstname,
            username: user.username, 
            avatar: user.avatar, 
        })
    }else if(typeof identifier === 'string'){
        const user = await knex('users').where('username', identifier.toLowerCase()).first()
        if(!user || !(await comparePasswords(password, user.password))){
            throw new AuthError('AUTHENTICATION_FAILED')
        }
        const { accessToken, refreshToken } = await createTokenPairOnAuth({ id: user.id }) 
        res.status(200).json({ 
            accessToken,
            refreshToken, 
            id: user.id,
            firstname: user.firstname,
            username: user.username, 
            avatar: user.avatar, 
        })
    }else{
        throw new AuthError('AUTHENTICATION_FAILED')
    }
})

interface RegisterRequest{
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    email: string,
}

export const registerUser = asyncWrapper(async (req: Request<{},{},RegisterRequest>, res, next) => {
    const { firstname, lastname, username, password, email } = req.body;

    if(!email) throw new AuthError('EMAIL_REQUIRED');
    if(!username) throw new AuthError('USERNAME_REQUIRED');
    if(!password) throw new AuthError('PASSWORD_REQUIRED');

    Joi.assert(email, Joi.string().trim().email())
    Joi.assert(username, Joi.string().trim().min(5).max(50))
    Joi.assert(password, Joi.string().trim().min(7).max(30).pattern(/[a-zA-Z0-9!@#$%^&*.]/))

    const userWithEmail = await knex('users').where('email', email.toLowerCase()).first()
    if(userWithEmail) throw new AuthError('EMAIL_IN_USE')

    const userWithUsername = await knex('users').where('username', username.toLowerCase()).first()
    if(userWithUsername) throw new AuthError('USERNAME_IN_USE')

    const hashbrowns = await hashPassword(password)

    const result = await knex('users')
        .insert({
            firstname, 
            lastname, 
            username: username.toLowerCase(), 
            email: email.toLowerCase(), 
            password: hashbrowns
        })
        .returning('*')

    const user = result[0];
    const { accessToken, refreshToken } = await createTokenPairOnAuth({ id: user.id }) 

    res.status(201).json({ 
        accessToken,
        refreshToken,
        id: user.id,
        firstname: user.firstname,
        username: user.username, 
        avatar: user.avatar, 
    })

})


interface DeleteUser {
    token: string
}

export const deleteAccount = asyncWrapper(async (req: Request<{},{},DeleteUser>, res, next) => {
    const { token } = req.body
    if(!token) throw new AuthError('AUTHENTICATION_REQUIRED')
    const { id } = await verifyRefreshToken(token)
    await knex('users').where({ id }).del()
    res.status(204).json({ message: `User with id ${id} deleted`})
})

interface CheckEmailQuery {
    email: string
}

export const checkEmailAvailability = asyncWrapper(async (req: Request<{},{},{},CheckEmailQuery>, res, next) => {
    const { email } = req.query;
    const user = await knex('users').where('email', email.toLowerCase()).first()
    res.status(200).json({ email, available: Boolean(!user) })
})


interface CheckUsernameQuery {
    username: string
}

export const checkUsernameAvailability = asyncWrapper(async (req: Request<{},{},{},CheckUsernameQuery>, res, next) => {
    const { username } = req.query;
    const user = await knex('users').where('username', username.toLowerCase()).first()
    res.status(200).json({ username, available: Boolean(!user) })
});

interface NewAccessTokenReq {
    /** Refresh Token */
    token: string
    includeUser: boolean
}

export const issueNewAccessToken = asyncWrapper(async (req: Request<{},{},NewAccessTokenReq>, res, next) => {
    const { token, includeUser } = req.body;
    const { accessToken, refreshToken, user: id } = await refreshExistingTokenPair(token)
    if(includeUser){
        const user = await knex('users')
            .select('firstname', 'username', 'avatar')
            .where({ id })
            .first()
        if(!user) throw new AuthError('AUTHENTICATION_FAILED')
        const { firstname, username, avatar} = user;
        res.status(200).json({ id, firstname, username, avatar, accessToken, refreshToken })
    }else{
        res.status(200).json({ accessToken, refreshToken })
    }
    res.status(200).json({ accessToken, refreshToken })
})


interface ForgotPasswordReq {
    email: string
}

export const forgotPassword = asyncWrapper(async (req: Request<{},{},ForgotPasswordReq>, res, next) => {
    const { email } = req.body;
    if(!email) throw new AuthError('EMAIL_REQUIRED')
    const user = await knex('users').where({ email: email.toLowerCase() }).first()
    if(user) {
        const token = crypto.randomBytes(32).toString('base64url')
        await redis.set(token, user.id, { EX: (60 * 15) })
        await sendPasswordResetEmail({ emailAddress: email, resetPasswordToken: token })
    }
    res.status(200).json({ message: 'Request received' })
})

interface ResetPasswordReq {
    token: string
    password: string
}

export const resetPassword = asyncWrapper(async (req: Request<{},{},ResetPasswordReq>, res, next) => {
    const { token, password } = req.body;
    const user = await redis.get(token)
    if(!user) throw new AuthError('TOKEN_INVALID')
    await redis.del(token)
    const hash = await hashPassword(password)
    const updated = await knex('users')
        .where('id', user)
        .update({ password: hash })
    res.status(200).json({ message: 'Password successfully changed' })
})