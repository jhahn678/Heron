type ErrorType = 
| 'INVALID_CREDENTIALS' | 'EMAIL_IN_USE'
| 'USERNAME_IN_USE' | 'EMAIL_INVALID'
| 'USERNAME_INVALID' | 'EMAIL_REQUIRED'
| 'USERNAME_REQUIRED' | 'PASSWORD_REQUIRED'

export class AuthError extends Error{
    status: number = 400
    message: string = 'Authentication error'

    constructor(errorType: ErrorType){
        super();
        switch(errorType){
            case 'INVALID_CREDENTIALS':
                this.message = 'The credentils provided are invalid';
                break;
            case 'EMAIL_INVALID':
                this.message = 'The email provided is invalid';
                break;
            case 'EMAIL_IN_USE':
                this.message = 'The email provided is already in use';
                break;
            case 'USERNAME_INVALID':
                this.message = 'The username provided is invalid';
                break;
            case 'USERNAME_IN_USE':
                this.message = 'The username provided is already in user ';
                break;
            case 'EMAIL_REQUIRED':
                this.message = 'Email not provided';
                break;
            case 'USERNAME_REQUIRED':
                this.message = 'Username not provided';
                break;
            case 'PASSWORD_REQUIRED':
                this.message = 'Password not provided';
                break;
            default:
                break;
        }
    }
}