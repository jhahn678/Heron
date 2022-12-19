import { Request } from "express";
import knex from "../../configs/knex";
import { AuthError } from "../../utils/errors/AuthError";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";

interface ReqBody{
    email: string
}

/** @Middleware authenticateRequest sets user property */
export const changeEmail = asyncWrapper(async (req: Request<{},{},ReqBody>, res) => {
    const { email } = req.body;
    try{
        const [updated] = await knex('users')
            .where({ id: req.user })
            .update({ email }, '*') 
        res.status(200).json({ id: updated.id, email: updated.email })
    }catch(err){
        throw new AuthError("EMAIL_IN_USE")
    }
})