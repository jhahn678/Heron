import { AuthenticationError } from "apollo-server-core";
import knex, { st } from "../../../configs/knex";
import { CatchQuery, CatchSort, QueryResolvers } from "../../../types/graphql";
import { CatchQueryError } from "../../../utils/errors/CatchQueryError";

export const getCatches: QueryResolvers['catches'] = async (_, { 
    id, type, offset, limit, coordinates, within, sort 
}, { auth }) => {
    const query = knex("catches").select("*",
        knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
        knex.raw(`(
            select row_to_json(img) 
            from catch_map_images as img 
            where catch = catches.id) as map_image`)
    );
    switch(type){
        case CatchQuery.User:
            if(!id) throw new CatchQueryError('ID_NOT_PROVIDED');
            query.where('user', id); 
            break;
        case CatchQuery.Waterbody:
            if(!id) throw new CatchQueryError('ID_NOT_PROVIDED');
            query.where('waterbody', id); 
            break;
        case CatchQuery.Following:
            if(!auth) throw new AuthenticationError('Not Authenticated')
            query.whereIn("user", function(){
                this.select("following")
                    .from('userFollowers')
                    .where('user',auth)
            })
            break;
        case CatchQuery.Coordinates:
            if(!coordinates) throw new CatchQueryError('COORDINATES_NOT_PROVIDED')
            break;
    }
    switch(sort){
        case(CatchSort.CreatedAtNewest):
            query.orderBy('created_at', 'desc')
            break;
        case(CatchSort.CreatedAtOldest):
            query.orderBy('created_at', 'asc')
            break;
        case(CatchSort.LengthLargest):
            query.orderBy('length', 'desc')
            break;
        case(CatchSort.WeightLargest):
            query.orderBy('weight', 'desc')
            break;
        case(CatchSort.Nearest):
            if(!coordinates) throw new CatchQueryError('COORDINATES_NOT_PROVIDED')
            const { latitude, longitude } = coordinates;
            const point = st.transform(st.setSRID(st.point(longitude, latitude),4326),3857);
            if(within) query.where(st.dwithin('geom', point, within, false))
            query.orderByRaw('geom <-> ?', [point])
            break;
        default:
            query.orderBy('created_at', 'desc')
    }
    query.offset(offset || 0)
    query.limit(limit || 20)
    const result = await query;
    return result;
}