import { RequestHandler } from 'express'
import { verifyAccessToken } from '../auth/token';
import { AuthError } from '../errors/AuthError';

/** Ensures that a valid access token is PRESENT in headers */
export const authenticateRequest: RequestHandler = (req, res, next) => {
    try{
        const { authorization } = req.headers;
        if(!authorization) throw new AuthError('AUTHENTICATION_REQUIRED')
        const payload = verifyAccessToken(authorization.split(' ')[1], { error: 'EXPRESS'})
        req.user = payload.id;
        next()
    }catch(err){
        console.error(err)
        next(err)
    }
}
