import { Request } from "express";
import Joi from "joi";
import knex from "../../configs/knex";
import { hashPassword } from "../../utils/auth/passwords";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

export const resetPassword = asyncWrapper(async (req: Request<{},{},{ token: string, password: string }>, res) => {
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

