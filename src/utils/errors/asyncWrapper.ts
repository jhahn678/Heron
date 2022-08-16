import { Request, Response, NextFunction } from "express"

type Controller = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => Promise<void>

export const asyncWrapper = (controller: Controller) => (
    req: Request, res: Response, next: NextFunction
) => {
    controller(req, res, next).catch(err => next(err))
}