import knex, { st } from "../../../configs/knex";
import { LocationQuery, LocationSort, Privacy, QueryResolvers } from "../../../types/graphql";
import { LocationQueryError } from "../../../utils/errors/LocationQueryError";

export const getLocations: QueryResolvers['locations'] = async (_, { 
    id, type, coordinates, limit, offset, sort 
}, { auth }) => {
    if(!id) throw new LocationQueryError('ID_NOT_PROVIDED')
    const query = knex("locations").select(
        "*",
        knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
        knex.raw(`(select count(*) from location_favorites where location = locations.id) as total_favorites`),
        knex.raw(`(select row_to_json(img) from location_map_images as img where location = locations.id) as map_image`)
    );
    switch(type){
        case LocationQuery.User:
            query.where('user', id)
            query.andWhere('privacy', Privacy.Public)
            if(auth) query.orWhereRaw(`
                "id" = ? and privacy = 'FRIENDS' and "user" in (
                    select "following" from user_followers where "user" = ?
                )
            `,[id, auth])
            break;
        case LocationQuery.UserSaved:
            query.whereRaw(`"id" in (
                select location from saved_locations where "user" = ?
            )`,[id])
            break;
        case LocationQuery.Waterbody:
            query.where('waterbody', id)
            query.andWhere('privacy', Privacy.Public)
            if(auth) query.orWhereRaw(`
                "id" = ? and privacy = 'FRIENDS' and "user" in (
                    select "following" from user_followers where "user" = ?
            )`,[id, auth])
            break;
    }
    switch (sort) {
        case LocationSort.CreatedAtNewest:
        query.orderBy("created_at", "desc");
        break;
        case LocationSort.CreatedAtOldest:
        query.orderBy("created_at", "asc");
        break;
        case LocationSort.MostRecommended:
        query.orderByRaw(`(
            select count(*) from location_favorites where location = ?
        ) desc`, [id])
        break;
        case LocationSort.Nearest:
        if (!coordinates) throw new LocationQueryError("COORDINATES_NOT_PROVIDED");
        const { latitude, longitude } = coordinates;
        const point = st.transform(st.setSRID(st.point(longitude, latitude), 4326),3857);
        query.orderByRaw("geom <-> ?", [point]);
        break;
        default:
        query.orderBy("created_at", "desc");
        break;
    }
    query.offset(offset || 0)
    query.limit(limit || 20)
    const results = await query;
    return results;
}