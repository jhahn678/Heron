import { asyncWrapper } from "../utils/errors/asyncWrapper"
import { hashPassword, comparePasswords } from '../utils/auth/passwords'
import { AuthError } from "../utils/errors/AuthError"
import Joi from "joi"
import { Request } from 'express'


interface LoginRequest {
    identifier: string,
    password: string
}

export const loginUser = asyncWrapper(async (req, res, next) => {
    const { identifier, password } = req.body;
    if(identifier.includes('@' && '.')){
        //query for email
    }else{
        //query for username
    }
})

interface RegisterRequest{
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
}

export const registerUser = asyncWrapper(async (req: Request<{},{},RegisterRequest>, res, next) => {
    const { firstName, lastName, username, password, email } = req.body;

    if(!email) throw new AuthError('EMAIL_REQUIRED');
    if(!username) throw new AuthError('USERNAME_REQUIRED');
    if(!password) throw new AuthError('PASSWORD_REQUIRED');

    Joi.assert(email, Joi.string().trim().email())
    Joi.assert(username, Joi.string().trim().min(5).max(50))
    Joi.assert(password, Joi.string().trim().min(7).max(30).pattern(/[a-zA-Z0-9!@#$%^&*.]/))

    //create new user 
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
    
})


interface CheckUsernameQuery {
    username: string
}

export const checkUsernameAvailability = asyncWrapper(async (req: Request<{},{},{},CheckUsernameQuery>, res, next) => {
    const { username } = req.query;
})