import knex from "../../../configs/knex";
import { QueryResolvers } from "../../../types/graphql";

export const getWaterbody: QueryResolvers['waterbody'] = async (_, { id }, { auth }) => {
    const query = knex("waterbodies").where("id", id)
    if(auth) query.select("*",
        knex.raw(`(select exists (
        select "user" from saved_waterbodies 
        where "user" = ? and waterbody = ?
        )) as is_saved`,[auth, id]
    ));
    const result = await query.first();
    return result
}