import { Request } from "express";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { validateEmail } from "../../utils/validations/validateEmail";

export const checkEmailAvailability = asyncWrapper(async (req: Request<{},{},{},{ email: string }>, res) => {
    const { email } = req.query;
    try{
        validateEmail(email)
        const user = await knex('users').where('email', email.toLowerCase()).first()
        res.status(200).json({ email, available: Boolean(!user), valid: true })
    }catch(err){
        res.status(200).json({ email, available: true, valid: false })
    }
})
