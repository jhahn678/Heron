export {}

declare module "express-serve-static-core" {
    interface Request {
      user?: number
    }
}

declare global{
  namespace Express {
    export interface Request {
        user?: number;
    }
  }
}