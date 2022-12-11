import knex from "../../../configs/knex";
import { Privacy, QueryResolvers } from "../../../types/graphql";

export const getLocation: QueryResolvers['location'] = async (_, { id }, { auth }) => {
    const query = knex("locations")
        .select("*",
        knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
        knex.raw(`(select row_to_json(img) from location_map_images as img where location = locations.id) as map_image`),
        knex.raw(`(select count(*) from location_favorites where location_favorites.location = locations.id) as total_favorites`)
        )
        .where("id", id)
        .andWhere("privacy", "=", Privacy.Public);
    if(auth){
        query.orWhereRaw(`"id" = ? and "user" = ?`,[id, auth])
        query.orWhereRaw(`"id" = ? and privacy = 'FRIENDS' and "user" in (
            select "following" from user_followers where "user" = ?
        )`,[id,auth])
        query.select(
            knex.raw(`( select exists (
                select "user" from location_favorites where "user" = ? and location = ?)
            ) as is_favorited`,[auth, id]),
            knex.raw(`( select exists (
                select "user" from saved_locations where "user" = ? and location = ?)
            ) as is_saved`, [auth, id])
        );
    }else{
        query.select(
            knex.raw('false as is_favorited'),
            knex.raw('false as is_saved')
        )
    }
    const location = await query.first()
    return location;
}