import Joi from "joi"
import { AuthError, AuthErrorType } from "../errors/AuthError"


/**
 * Throws 400 if password is invalid
 * @param password 
 */

export const validatePassword = (password: string) => {
    try{ 
        const schema = Joi.string().trim().min(7).max(30).pattern(/[a-zA-Z0-9!@#$%^&*.]{7,30}/)
        Joi.assert(password, schema) 
        return password;
    }
    catch(err){ 
        throw new AuthError("PASSWORD_INVALID") 
    }
}