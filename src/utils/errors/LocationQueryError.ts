import { ApolloError } from 'apollo-server-errors';

type ErrorType = 
| 'QUERY_LOCATION_NOT_PROVIDED'
| 'ID_NOT_PROVIDED'

export class LocationQueryError extends ApolloError {
  constructor(type: ErrorType) {
    let message = 'There was an error with your query'
    switch(type){
      case 'QUERY_LOCATION_NOT_PROVIDED':
        message = 'A query location object was not provided on a location based query'
        break;
      case 'ID_NOT_PROVIDED':
        message = 'ID was not provided on an ID based query'
        break;
    }
    super(message, type);
    Object.defineProperty(this, 'name', { value: 'LocationQueryError' });
  }
}