type ErrorType = 
| 'INVALID_WATERBODY'

export class NewCatchError extends Error {
    status: number = 400;
    message: string = 'Error creating new catch';

    constructor(errorType: ErrorType){
        super()
        switch(errorType){
            case 'INVALID_WATERBODY':
                break;
            default:
                break;
        }
    }
}