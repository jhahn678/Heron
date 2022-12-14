import { Request } from "express";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";
import { validateEmail } from "../../utils/validations/validateEmail";

interface ReqBody{
    email: string
}

/** @Middleware authenticateRequest sets user property */
export const changeEmail = asyncWrapper(async (req: Request<{},{},ReqBody>, res) => {
    const email = validateEmail(req.body.email)
    try{
        const [updated] = await knex('users')
            .where({ id: req.user })
            .update({ email: email.toLowerCase() }, '*') 
        res.status(200).json({ id: updated.id, email: updated.email })
    }catch(err){
        throw new AuthError("EMAIL_IN_USE")
    }
})