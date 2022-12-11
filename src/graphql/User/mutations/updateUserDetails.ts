import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";
import { UserDetailsUpdate } from "../../../types/User";
import { RequestError } from "../../../utils/errors/RequestError";

export const updateUserDetails:  MutationResolvers['updateUserDetails'] = async (_, { details }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const update: UserDetailsUpdate = {};
    const { firstname, lastname, city, state, bio } = details;
    if(firstname) update.firstname = firstname;
    if(lastname) update.lastname = lastname;
    if(state) update.state = state;
    if(city) update.city = city;
    if(bio) update.bio = bio;
    const [result] = await knex('users')
        .where({ id: auth })
        .update({ ...update })
        .returning('*')
    if(!result) throw new RequestError('TRANSACTION_NOT_FOUND')
    return result;
}