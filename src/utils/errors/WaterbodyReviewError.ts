import { ApolloError } from 'apollo-server-errors';

type Message = 
| 'Review from user already exists'
| 'Invalid rating provided'

export class WaterbodyReviewError extends ApolloError {
    name: string
    constructor(message: Message) {
        super(message, 'WATERBODY_REVIEW_ERROR');
        switch(message){
            case 'Review from user already exists':
                this.name = 'DuplicateReviewError'
                break;
            case 'Invalid rating provided':
                this.name = 'InvalidRatingError';
                break;
            default:
                this.name = 'UnhandledWaterbodyError'
                break;
        }
    }
}