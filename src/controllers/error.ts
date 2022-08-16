import { ErrorRequestHandler } from 'express'


export const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status).json({ error: err.message })
}