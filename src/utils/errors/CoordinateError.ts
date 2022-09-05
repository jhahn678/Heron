type ErrorType = 
| 'INVALID_COORDINATES'
| 'INVALID_LONGITUDE'
| 'INVALID_LATITUDE' 
| 'NOT_WITHIN_BOUNDARY'

export class CoordinateError extends Error{
    status: number = 400
    message: string = 'There was an error with the location you provided'

    constructor(errorType: ErrorType){
        super()
        switch(errorType){
            case 'INVALID_COORDINATES':
                this.message = 'Coordinates are in an invalid format'
                break
            case 'INVALID_LATITUDE':
                this.message = 'Invalid latitude value'
                break
            case 'INVALID_LONGITUDE':
                this.message = 'Invalid longitude value'
                break
            case 'NOT_WITHIN_BOUNDARY':
                this.message = 'Coordinates are not within boundary of dataset'
                break
        }
    }
}