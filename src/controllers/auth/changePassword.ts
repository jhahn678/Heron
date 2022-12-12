import { Request } from "express";
import knex from "../../configs/knex";
import { hashPassword } from "../../utils/auth/passwords";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";

interface ReqBody {
    password: string
}

/** @Middleware authenticateRequest sets user property */
export const changePassword = asyncWrapper(async (req: Request<{},{},ReqBody>, res) => {
    const { password } = req.body;
    const hashed = await hashPassword(password)
    await knex('users').where('id', req.user).update('password', hashed)
    res.status(200).json({ message: "Password successfully changed" })
})