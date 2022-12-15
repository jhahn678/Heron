import { ErrorRequestHandler } from 'express'


export const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({ 
        error: err.message || "Something went wrong",
        code: err.code || "ERROR"
    })
}