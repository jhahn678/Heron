import Joi from "joi"
import { AuthError } from "../errors/AuthError";

/**
 * Throws 400 if username is invalid
 * @param username 
 */
export const validateUsername = (username: string) => {
    const schema = Joi.string().trim().min(5).max(36);
    try{
        Joi.assert(username, schema)
        return username;
    }catch(err){
        throw new AuthError('USERNAME_INVALID')
    }
}