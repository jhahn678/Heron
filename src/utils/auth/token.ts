import * as jwt from 'jsonwebtoken'
import { AuthError } from '../errors/AuthError'

interface TokenPayload {
    id: number
}

export const createAuthToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    })
}
