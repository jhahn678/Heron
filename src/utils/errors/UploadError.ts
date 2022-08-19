type ErrorType = 
| 'FILE_TYPE_REQUIRED' | 'INVALID_FILE_TYPE' 
| 'INVALID_URL'

export class UploadError extends Error {
    status: number = 400
    message: string = 'Error uploading file'
    constructor(errorType: ErrorType){
        super();
        switch(errorType){
            case 'FILE_TYPE_REQUIRED':
                this.message = 'File type query parameter was not provided'
                break;
            case 'INVALID_FILE_TYPE':
                this.message = 'File type provided is not valid'
                break;
            case 'INVALID_URL':
                this.message = 'URL provided is from unknown source'
                break;
            default:
                break;
        }
    }
}