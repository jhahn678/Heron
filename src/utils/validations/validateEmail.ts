import Joi from "joi"
import { AuthError } from "../errors/AuthError"

/**
 * Throws 400 if email is invalid
 * @param email
 */

export const validateEmail = (email: string) => {
    try{
        Joi.assert(email, Joi.string().trim().email())
        return email;
    }catch(err){
        throw new AuthError("EMAIL_INVALID")
    }
}