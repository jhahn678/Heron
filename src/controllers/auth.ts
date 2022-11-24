import knex from "../configs/knex"
import Joi from "joi"
// import redis from "../configs/redis"
import * as crypto from 'crypto'
import { asyncWrapper } from "../utils/errors/asyncWrapper"
import { v4 as uuid } from 'uuid'
import { hashPassword, comparePasswords } from '../utils/auth/passwords'
import { AuthError } from "../utils/errors/AuthError"
import { Request } from 'express'
import { sendPasswordResetEmail } from "../utils/email/resetPasswordEmailConfig"
import { RequestError } from "../utils/errors/RequestError"
import { validateMediaUrl } from "../utils/validations/validateMediaUrl"
import { FacebookResponse, GoogleResponse, IUser, NewUserFacebook, NewUserGoogle, NewUserObject } from "../types/User"
import { refreshExistingTokenPair, createTokenPairOnAuth, verifyRefreshToken, verifyAccessToken, REFRESH_TOKEN_MAX_AGE } from "../utils/auth/token"
import fetch from 'node-fetch'
import { AuthCookie, LinkedAccount } from "../types/Auth"

interface LoginRequest {
    identifier: string,
    password: string
}

export const loginUser = asyncWrapper(async (req: Request<{},{},LoginRequest>, res) => {
    const { identifier, password } = req.body;
    if(typeof identifier !== 'string') throw new AuthError('AUTHENTICATION_FAILED')
    let user: IUser | undefined;
    user = await knex('users').where('email', identifier.toLowerCase()).first()
    if(!user) user = await knex('users').where('username', identifier.toLowerCase()).first()
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
        avatar: user.avatar, 
    })
})

interface RegisterRequest{
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    email: string,
    avatar: { key: string, url: string } | null | undefined
    city: string | null | undefined
    state: string | null | undefined
    bio: string | null | undefined
}

export const registerUser = asyncWrapper(async (req: Request<{},{},RegisterRequest>, res) => {
    const { firstname, lastname, username, password, email, avatar, city, state, bio } = req.body;

    if(!email) throw new AuthError('EMAIL_REQUIRED');
    if(!username) throw new AuthError('USERNAME_REQUIRED');
    if(!password) throw new AuthError('PASSWORD_REQUIRED');

    try{ Joi.assert(email, Joi.string().trim().email()) }
    catch(err){ throw new AuthError('EMAIL_INVALID') }
    try{ Joi.assert(username, Joi.string().trim().min(5).max(50)) }
    catch(err){ throw new AuthError('USERNAME_INVALID') }
    try{ Joi.assert(password, Joi.string().trim().min(7).max(30).pattern(/[a-zA-Z0-9!@#$%^&*.]{7,30}/)) }
    catch(err){ throw new AuthError('PASSWORD_INVALID') }

    const userWithEmail = await knex('users').where('email', email.toLowerCase()).first()
    if(userWithEmail) throw new AuthError('EMAIL_IN_USE')

    const userWithUsername = await knex('users').where('username', username.toLowerCase()).first()
    if(userWithUsername) throw new AuthError('USERNAME_IN_USE')

    const hashbrowns = await hashPassword(password)

    const newUser: NewUserObject = { 
        username: username.toLowerCase(), 
        email: email.toLowerCase(), 
        password: hashbrowns 
    }

    if(firstname) newUser.firstname = firstname;
    if(lastname) newUser.lastname = lastname;
    if(state) newUser.state = state;
    if(city) newUser.city = city;
    if(bio) newUser.bio = bio;

    const [user] = await knex('users').insert(newUser, '*')
        
    let url: string | undefined;

    if(avatar && validateMediaUrl(avatar.url)){
        const [result] = await knex('userAvatars').insert({ ...avatar, user: user.id }, '*')
        await knex('users').where({ id: user.id }).update({ avatar: result.url })
        url = result.url;
    }

    const tokens = await createTokenPairOnAuth({ id: user.id }) 
    res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
    res.status(201).json({ 
        ...tokens,
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username, 
        avatar: url, 
    })

})

export const clearAuthentication = asyncWrapper(async(req, res) => {
    console.log(req.cookies)
    const refreshToken = req.cookies[AuthCookie.refreshToken];
    if(!refreshToken) throw new AuthError('REFRESH_TOKEN_INVALID')
    res.clearCookie(AuthCookie.refreshToken)
    const { jti } = await verifyRefreshToken(refreshToken)
    await knex('refreshTokens').where({ jwtid: jti }).del()
    res.status(200).json({ message: 'User logged out' })
})

export const deleteAccount = asyncWrapper(async (req: Request<{},{},{ token: string }>, res, next) => {
    const { token } = req.body
    if(!token) throw new AuthError('AUTHENTICATION_REQUIRED')
    const { id } = await verifyRefreshToken(token)
    await knex('users').where({ id }).del()
    res.status(204).json({ message: `User with id ${id} deleted`})
})

export const checkEmailAvailability = asyncWrapper(async (req: Request<{},{},{},{ email: string }>, res) => {
    const { email } = req.query;
    try{
        Joi.assert(email, Joi.string().trim().email())
        const user = await knex('users').where('email', email.toLowerCase()).first()
        res.status(200).json({ email, available: Boolean(!user), valid: true })
    }catch(err){    //@ts-ignore
        const valid = !Boolean(err?.name === 'ValidationError')
        res.status(200).json({ email, available: true, valid })
    }
})


export const checkUsernameAvailability = asyncWrapper(async (req: Request<{},{},{},{ username: string }>, res) => {
    const { username } = req.query;
    try{
        Joi.assert(username, Joi.string().trim().min(5).max(50))
        const user = await knex('users').where('username', username.toLowerCase()).first()
        res.status(200).json({ username, available: Boolean(!user) })
    }catch(err){
        res.status(200).json({ username, available: false })
    }
});

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

export const forgotPassword = asyncWrapper(async (req: Request<{},{},{ email: string }>, res) => {
    const { email } = req.body;
    if(!email) throw new AuthError('EMAIL_REQUIRED')
    const user = await knex('users').where({ email: email.toLowerCase() }).first()
    if(user) {
        const token = crypto.randomBytes(32).toString('base64url')
        await knex('passwordResetTokens')
            .insert({ user: user.id, token })
            .onConflict('user')
            .merge(['token', 'created_at'])
        await sendPasswordResetEmail({ emailAddress: email, resetPasswordToken: token })
    }
    res.status(200).json({ message: 'Request received' })
})

export const resetPassword = asyncWrapper(async (req: Request<{},{},{
    token: string
    password: string
}>, res) => {

    const { token, password } = req.body;

    try{ Joi.assert(password, Joi.string().trim().min(7).max(30).pattern(/[a-zA-Z0-9!@#$%^&*.]{7,30}/)) }
    catch(err){ throw new AuthError('PASSWORD_INVALID') }

    const [result] = await knex('passwordResetTokens').where({ token }).del('*')
    if(!result) throw new AuthError('TOKEN_INVALID')

    const limit = Date.now() - (1000 * 60 * 15)
    const created = Date.parse(result.created_at.toString())
    if(created < limit) throw new AuthError('TOKEN_EXPIRED')

    const hash = await hashPassword(password)
    await knex('users').where('id', result.user).update({ password: hash })
    res.status(200).json({ message: 'Password successfully changed' })
})

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

interface AppleLoginBody {
    apple_id: string
    firstname?: string
    lastname?: string
}

export const loginWithApple  = asyncWrapper(async (req: Request<{},{},AppleLoginBody>, res) => {
    const { apple_id, firstname, lastname } = req.body;
    if(!apple_id) throw new AuthError('AUTHENTICATION_FAILED')
    const user =  await knex('users').where({ apple_id }).first()
    if(user){
        const tokens = await createTokenPairOnAuth({ id: user.id }) 
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({ 
            ...tokens, 
            id: user.id,
            avatar: user.avatar, 
            username: user.username, 
            firstname: user.firstname,
            lastname: user.lastname,
            account_created: false
        })
    }else{
        const username = 'u-' + uuid().split('-').join('').slice(0,16).toLowerCase()
        const userObj: AppleLoginBody & { username: string } = { apple_id, username };
        if(firstname) userObj['firstname'] = firstname;
        if(lastname) userObj['lastname'] = lastname;
        const [newUser] = await knex('users').insert(userObj, '*')
        const tokens = await createTokenPairOnAuth({ id: newUser.id })
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({
            ...tokens,
            id: newUser.id,
            avatar: newUser.avatar,
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            account_created: true
        })
    }
})

export const loginWithGoogle = asyncWrapper(async (req: Request<{},{},{ accessToken: string }>, res) => {
    const { accessToken } = req.body;
    if(!accessToken) throw new AuthError('AUTHENTICATION_FAILED')
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    let response: GoogleResponse;
    try{
        response = await (await fetch(url)).json()
    }catch(err){
        console.error(err)
        throw new AuthError('GOOGLE_AUTH_FAILED')
    }
    const { 
        sub: google_id, 
        picture: avatar,
        family_name: lastname, 
        given_name: firstname, 
    } = response;
    const user = await knex('users').where('google_id', google_id).first()
    if(user){
        const tokens = await createTokenPairOnAuth({ id: user.id }) 
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({ 
            ...tokens, 
            id: user.id,
            avatar: user.avatar, 
            username: user.username, 
            firstname: user.firstname,
            lastname: user.lastname,
            account_created: false
        })
    }else{
        const username = 'u-' + uuid().split('-').join('').slice(0,16).toLowerCase()
        const userObj: NewUserGoogle = { username, google_id };
        if(avatar) userObj['avatar'] = avatar;
        if(firstname) userObj['firstname'] = firstname;
        if(lastname) userObj['lastname'] = lastname;
        const [newUser] = await knex('users').insert(userObj, '*')
        const tokens = await createTokenPairOnAuth({ id: newUser.id }) 
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({
            ...tokens,
            id: newUser.id,
            avatar: newUser.avatar,
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            account_created: true
        })
    }
})

export const loginWithFacebook = asyncWrapper(async (req: Request<{},{},{ accessToken: string }>, res) => {
    const { accessToken } = req.body;
    if(!accessToken) throw new AuthError('ACCESS_TOKEN_REQUIRED')
    const url = `https://graph.facebook.com/me?fields=id,first_name,last_name,picture&access_token=${accessToken}`
    let response: FacebookResponse;
    try{
        response = await (await fetch(url)).json()
    }catch(err){
        console.error(err)
        throw new AuthError('FACEBOOK_AUTH_FAILED')
    }
    const { id: facebook_id, first_name, last_name, picture } = response
    const exists = await knex('users').where('facebook_id', facebook_id).first()
    if(exists){
        const tokens = await createTokenPairOnAuth({ id: exists.id }) 
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({ 
            ...tokens, 
            id: exists.id,
            avatar: exists.avatar, 
            username: exists.username, 
            firstname: exists.firstname,
            lastname: exists.lastname,
            account_created: false
        })
    }else{
        const username = 'u-' + uuid().split('-').join('').slice(0,16).toLowerCase()
        const newUser: NewUserFacebook = { facebook_id, username }
        if(first_name) newUser['firstname'] = first_name;
        if(last_name) newUser['lastname'] = last_name;
        if(picture?.data?.url) newUser['avatar'] = picture.data.url;
        const [result] = await knex('users').insert(newUser, '*')
        const tokens = await createTokenPairOnAuth({ id: result.id })
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({
            ...tokens, 
            id: result.id,
            avatar: result.avatar, 
            username: result.username, 
            firstname: result.firstname,
            lastname: result.lastname,
            account_created: true
        })
    }
})

export const changeUsername = asyncWrapper(async (req: Request<{},{},{ token: string, username: string }>, res) => {
    const { token, username } = req.body;
    if(!token) throw new AuthError('AUTHENTICATION_FAILED')
    if(!username) throw new AuthError('USERNAME_REQUIRED')
    const { id } = verifyAccessToken(token, { error: 'EXPRESS' }) 
    try{
        Joi.assert(username, Joi.string().trim().min(5).max(50))
    }catch(err){
        throw new AuthError('USERNAME_INVALID')
    }
    try{
        const [updated] = await knex('users')
            .where({ id })
            .update({ username: username.toLowerCase() }, '*') 
        res.status(200).json({ id: updated.id, username: updated.username })
    }catch(err){
        throw new AuthError('USERNAME_IN_USE')
    }
})



export const hasPassword = asyncWrapper(async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) throw new AuthError('AUTHENTICATION_REQUIRED')
    const token = authorization.split(' ')[1]
    const { id } = verifyAccessToken(token, { error: 'EXPRESS' }) 
    const user = await knex('users').where('id', id).first('password')
    if(!user) throw new AuthError('ACCESS_TOKEN_INVALID')
    res.status(200).json({ hasPassword: Boolean(user.password) })
})



export const addPassword = asyncWrapper(async (req: Request<{},{},{ password: string }>, res) => {
    const { password } = req.body;
    const { authorization } = req.headers
    if(!authorization) throw new AuthError('AUTHENTICATION_REQUIRED')
    const token = authorization.split(' ')[1]
    const { id } = verifyAccessToken(token, { error: 'EXPRESS' }) 
    try{ Joi.assert(password, Joi.string().trim().min(7).max(30).pattern(/[a-zA-Z0-9!@#$%^&*.]{7,30}/)) }
    catch(err){ throw new AuthError('PASSWORD_INVALID') }
    const result = await knex('users').where('id', id).update('password', password, 'id')
    if(result.length === 0) throw new RequestError('REQUEST_FAILED')
    res.status(200).json({ updated: true })
})

interface UnlinkUpdate {
    apple_id?: null
    facebook_id?: null
    google_id?: null
}

export const unlinkAccount = asyncWrapper(async (req: Request<{},{},{ account: LinkedAccount }>, res) => {
    const { account } = req.body
    const { authorization } = req.headers
    if(!authorization) throw new AuthError('AUTHENTICATION_REQUIRED')
    const token = authorization.split(' ')[1]
    const { id } = verifyAccessToken(token, { error: 'EXPRESS' }) 
    const update: UnlinkUpdate = {};
    if(account === LinkedAccount.Apple) update['apple_id'] = null;
    if(account === LinkedAccount.Facebook) update['facebook_id'] = null;
    if(account === LinkedAccount.Google) update['google_id'] = null;
    const result = await knex('users').where('id', id).update(update, 'id')
    if(result.length === 0) throw new RequestError('REQUEST_FAILED')
    res.status(200).json({ updated: true })
})