import { ValidationError } from 'express-validator'

export class RequestValidationError extends Error {
    status: number = 400;
    message: string = "There was an error with the values you provided"
    code: string = "VALIDATION_ERROR"
    errors: { message: string, field: string }[] = []
    constructor(public errs: ValidationError[]){
        super();
        this.errors = errs.map(err => ({
            message: err.msg, 
            field: err.param
        }))
    }
}