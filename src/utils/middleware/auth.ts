import { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../auth/token';
import { AuthError } from '../errors/AuthError';

/** Compares authentication token ID to field id in request body */
export const authorizeRequest = (req: Request, res: Response, next: NextFunction) => {
    try{
        const { authorization } = req.headers;
        const token = authorization?.split(' ')[1]
        if(!token) throw new AuthError('AUTHENTICATION_REQUIRED')
        const id = verifyAccessToken(token)
        if(!id || req.body.id !== id) throw new AuthError('AUTHENTICATION_FAILED')
        next()
    }catch(err){
        next(err)
    }

}
