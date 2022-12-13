import { Request } from "express";
import knex from "../../configs/knex";
import { hashPassword } from "../../utils/auth/passwords";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";
import { validatePassword } from "../../utils/validations/validatePassword";

interface ReqBody { 
    token: string, 
    password: string 
}

export const resetPassword = asyncWrapper(async (req: Request<{},{},ReqBody>, res) => {
    const { token } = req.body;
    const password = validatePassword(req.body.password)

    const [result] = await knex('passwordResetTokens').where({ token }).del('*')
    if(!result) throw new AuthError('TOKEN_INVALID')

    const limit = Date.now() - (1000 * 60 * 15)
    const created = Date.parse(result.created_at.toString())
    if(created < limit) throw new AuthError('TOKEN_EXPIRED')

    const hash = await hashPassword(password)
    await knex('users').where('id', result.user).update({ password: hash })
    res.status(200).json({ message: 'Password successfully changed' })
})

