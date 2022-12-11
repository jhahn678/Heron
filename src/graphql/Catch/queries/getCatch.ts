import knex from "../../../configs/knex";
import { QueryResolvers } from "../../../types/graphql";

export const getCatch: QueryResolvers['catch'] = async (_, { id }, { auth }) => {
    const query = knex("catches").where({ id }).select("*",
        knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
        knex.raw(`(select count(*) from catch_favorites where catch = ?) as total_favorites`,[id]),
        knex.raw(`(select row_to_json(img) from catch_map_images as img where catch = ?) as map_image`,[id]),
    )
    if(auth){
        query.select(knex.raw(`(select exists (
            select "user" from catch_favorites where "user" = ? and catch = ?
        )) as is_favorited`,[auth, id]));
    }else{
        query.select(knex.raw('false as is_favorited'))
    }

    const result = await query.first();
    return result;
}