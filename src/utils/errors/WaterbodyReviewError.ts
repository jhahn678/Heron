type ErrorType = 
| 'INVALID_RATING'

export class WaterbodyReviewError extends Error {
    message: string = 'Could not create review'
    status: number = 400
    constructor(errorType: ErrorType){
        super()
        switch(errorType){
            case 'INVALID_RATING':
                this.message = 'Provided rating is invalid'
                break;
            default:
                break;
        }
    }
}