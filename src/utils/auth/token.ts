import * as jwt from 'jsonwebtoken'

export interface TokenPayload {
    id: number
}

/** Returns signed JWT */
export const createAuthToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    })
}

/** Returns userID from auth header if jsonwebtoken is valid -- else returns UNDEFINED */
export const verifyAuthHeader = (authorizationHeader: string | undefined): number | undefined => {
    try{
        if(!authorizationHeader) return undefined;
        const token = jwt.verify(authorizationHeader, process.env.JWT_SECRET!);
        if(token && typeof token === 'object' && token.hasOwnProperty('id')){
            return token.id;
        }
    }catch{
        return undefined
    }
}

