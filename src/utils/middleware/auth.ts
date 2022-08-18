import { NextFunction, Request, Response } from 'express'
import { verifyAuthHeader } from '../auth/token';
import { AuthError } from '../errors/AuthError';

/** Compares authentication token ID to field id in request body */
export const authorizeRequest = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if(!authorization) next(new AuthError('AUTHENTICATION_REQUIRED'))
    const id = verifyAuthHeader(authorization)
    if(!id || req.body.id !== id) next(new AuthError('AUTHENTICATION_FAILED'))
    next()
}
