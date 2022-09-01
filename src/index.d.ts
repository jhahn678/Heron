declare module "express-serve-static-core" {
    interface Request {
        user?: number
    }
}

declare module 'jsonwebtoken' {
    interface JwtPayload {
        id: number,
        jti?: string
    }
}
