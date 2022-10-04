import { ApolloError } from 'apollo-server-errors';

type Message = 
| 'No geometry included'

export class CreateLocationError extends ApolloError {
    name: string
    constructor(message: Message) {
        super(message, 'CREATE_LOCATION_ERROR');
        switch(message){
            case 'No geometry included':
                this.name = 'MissingGeometryError'
                break;
            default:
                this.name = 'UnhandledCreateLocationError'
                break;
        }
    }
}