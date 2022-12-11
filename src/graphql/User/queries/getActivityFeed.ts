import { AuthenticationError } from "apollo-server-core";
import knex from "../../../configs/knex";
import { QueryResolvers } from "../../../types/graphql";

export const getActivityFeed: QueryResolvers['activityFeed'] = async(_, { limit, offset }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const results = await knex('catches')
        .select('*', knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"))
        .whereIn("user", function(){
            this.from('userFollowers')
            .select('following')
            .where('user', auth)
        })
        .orderBy('created_at', 'desc')
        .offset(offset || 0)
        .limit(limit || 10)
    return results;
}