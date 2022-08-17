import { asyncWrapper } from "../utils/errors/asyncWrapper"
import knex from "../db/knex"
import { hashPassword, comparePasswords } from '../utils/auth/passwords'
import { AuthError } from "../utils/errors/AuthError"
import Joi from "joi"
import { Request } from 'express'
import { createAuthToken } from "../utils/auth/token"
import { IUser } from "../types/User"


interface LoginRequest {
    identifier: string,
    password: string
}

export const loginUser = asyncWrapper(async (req, res, next) => {
    const { identifier, password } = req.body;
    if(identifier.includes('@' && '.')){
        const user = await knex('users').where('email', identifier).first()
        if(!user || !(await comparePasswords(password, user.password))){
            throw new AuthError('AUTHENTICATION_FAILED')
        }
        const token = createAuthToken({ id: user.id })
        res.status(200).json({ 
            token, 
            firstname: user.firstname,
            username: user.username, 
            avatar: user.avatar, 
        })
    }else{
        const user = await knex('users').where('username', identifier).first()
        if(!user || !(await comparePasswords(password, user.password))){
            throw new AuthError('AUTHENTICATION_FAILED')
        }
        const token = createAuthToken({ id: user.id })
        res.status(200).json({ 
            token, 
            firstname: user.firstname,
            username: user.username, 
            avatar: user.avatar, 
        })
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

    const userWithEmail = await knex('users').where('email', email).first()
    if(userWithEmail) throw new AuthError('EMAIL_IN_USE')

    const userWithUsername = await knex('users').where('username', username).first()
    if(userWithUsername) throw new AuthError('USERNAME_IN_USE')

    const hashbrowns = await hashPassword(password)

    const user = await knex('users').insert({
        firstname, lastname, username, email, password: hashbrowns
    }).returning('*')

    const token = createAuthToken({ id: user[0].id })

    res.status(201).json({ user, token })

})


export const forgotPassword = asyncWrapper(async (req, res, next) => {

})

export const resetPassword = asyncWrapper(async (req, res, next) => {

})

export const deleteAccount = asyncWrapper(async (req, res, next) => {

})

interface CheckEmailQuery {
    email: string
}

export const checkEmailAvailability = asyncWrapper(async (req: Request<{},{},{},CheckEmailQuery>, res, next) => {
    const { email } = req.query;
    const user = await knex('users').where('email', email).first()
    res.status(200).json({ email, available: Boolean(user) })
})


interface CheckUsernameQuery {
    username: string
}

export const checkUsernameAvailability = asyncWrapper(async (req: Request<{},{},{},CheckUsernameQuery>, res, next) => {
    const { username } = req.query;
    const user = await knex('users').where('username', username).first()
    res.status(200).json({ username, available: Boolean(user) })
})