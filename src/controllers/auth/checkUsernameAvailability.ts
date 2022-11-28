import { Request } from "express";
import Joi from "joi";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";

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