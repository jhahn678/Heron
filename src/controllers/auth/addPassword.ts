import { Request } from "express";
import Joi from "joi";
import knex from "../../configs/knex";
import { verifyAccessToken } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";
import { RequestError } from "../../utils/errors/RequestError";

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