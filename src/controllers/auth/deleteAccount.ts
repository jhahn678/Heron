import { Request } from "express"
import knex from "../../configs/knex"
import { verifyRefreshToken } from "../../utils/auth/token"
import { asyncWrapper } from "../../utils/errors/asyncWrapper"
import { AuthError } from "../../utils/errors/AuthError"

export const deleteAccount = asyncWrapper(async (req: Request<{},{},{ token: string }>, res, next) => {
    const { token } = req.body
    if(!token) throw new AuthError('AUTHENTICATION_REQUIRED')
    const { id } = await verifyRefreshToken(token)
    await knex('users').where({ id }).del()
    res.status(204).json({ message: `User with id ${id} deleted`})
})