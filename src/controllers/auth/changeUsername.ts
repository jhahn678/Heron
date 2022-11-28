import { Request } from "express";
import Joi from "joi";
import knex from "../../configs/knex";
import { verifyAccessToken } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

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
