type ErrorType = 
| 'INVALID_CREDENTIALS' 
| 'EMAIL_IN_USE'
| 'USERNAME_IN_USE' 
| 'EMAIL_INVALID'
| 'USERNAME_INVALID' 
| 'EMAIL_REQUIRED'
| 'USERNAME_REQUIRED' 
| 'PASSWORD_REQUIRED'
| 'AUTHENTICATION_REQUIRED' 
| 'AUTHENTICATION_FAILED'
| 'UNAUTHORIZED' 
| 'TOKEN_INVALID' 
| 'TOKEN_EXPIRED'
| 'ACCESS_TOKEN_EXPIRED'
| 'REFRESH_TOKEN_EXPIRED'
| 'PASSWORD_RESET_EMAIL_FAILED'

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
            case 'AUTHENTICATION_FAILED':
                this.message = 'Could not authenticate request';
                break;
            case 'AUTHENTICATION_REQUIRED':
                this.status = 403;
                this.message = 'Authentication not provided'
                break;
            case 'UNAUTHORIZED':
                this.status = 403;
                this.message = 'Request not authorized';
                break;
            case 'TOKEN_INVALID':
                this.status = 401;
                this.message = 'The provided authentication token is invalid';
                break;
            case 'TOKEN_EXPIRED':
                this.status = 401;
                this.message = 'The provided authentication token is expired';
                break;
            case 'PASSWORD_RESET_EMAIL_FAILED':
                this.message = 'Could not send password reset email';
                break;
            case 'ACCESS_TOKEN_EXPIRED':
                //Changing this will affect front end error handling
                //message text is being used as a means of auto refreshing access token
                this.message = 'Access token expired';
                this.status = 401;
                break;
            case 'REFRESH_TOKEN_EXPIRED':
                this.message = 'Refresh token expired';
                this.status = 401;
            default:
                break;
        }
    }
}