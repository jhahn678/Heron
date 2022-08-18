type ErrorType = 
| 'DUPLICATE_CONTACT' | 'DUPLICATE_CONTACT_REQUEST'
| 'DELETE_NOT_FOUND' | 'RESOURCE_NOT_FOUND'
| 'TRANSACTION_NOT_FOUND' | 'REQUEST_UNDEFINED'
| 'REQUEST_FAILED' | 'INVALID_REFERENCE' | 'COORDS_INVALID'

export class RequestError extends Error{
    status: number = 400;
    message: string;
    constructor(errorType: ErrorType){
        super()
        switch(errorType){
            case 'REQUEST_UNDEFINED':
                this.message = 'The request parameters sent are missing or undefined'
            case 'DUPLICATE_CONTACT':
                this.message = 'User already on contact list'
                break;
            case 'DUPLICATE_CONTACT_REQUEST':
                this.message = 'Contact request already exists to this user'
                break;
            case 'DELETE_NOT_FOUND':
                this.message = 'Provided resource could not be deleted because it does not exist';
                break;
            case 'RESOURCE_NOT_FOUND':
                this.message = 'The resource you requested does not exist';
                break;
            case 'TRANSACTION_NOT_FOUND':
                this.message = 'The provided request could not be completed because a resource you provided does not exist';
                break;
            case 'REQUEST_FAILED':
                this.message = 'The provided request could not be completed';
                break;
            case 'INVALID_REFERENCE':
                this.message = 'The reference your provided to another resource could not be found'
                break;
            case 'COORDS_INVALID':
                this.message = 'The coordinates provided are invalid';
                break;
        }
    }
}