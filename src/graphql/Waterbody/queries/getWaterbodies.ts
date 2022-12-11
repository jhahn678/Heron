import knex, { st } from "../../../configs/knex";
import { QueryResolvers, Sort } from "../../../types/graphql";

export const getWaterbodies: QueryResolvers['waterbodies'] = async (_, args) => {
    const { value, classifications, adminOne, queryLocation, offset, limit, sort } = args;
    const query = knex('waterbodies')
    if(value) query.whereILike('name', (value+'%'))
    if(classifications) query.whereIn('classification', classifications)
    if(adminOne) query.whereRaw(`admin_one && array[${adminOne.map(() => '?').join(',')}]::varchar[]`, adminOne)
    if(queryLocation) {
        const { latitude, longitude, withinMeters } = queryLocation;
        const point = st.transform(st.setSRID(st.point(longitude, latitude), 4326), 3857)
        query.select('id', 'name', 'classification', 'country', 'ccode', 
            'admin_one', 'admin_two', 'subregion', 'weight', 'oid', 
            knex.raw('simplified_geometries <-> ? as distance', point), 
            knex.raw('rank_result(simplified_geometries <-> ?, weight, ?) as rank', [point, withinMeters])
        )
        query.where(st.dwithin('simplified_geometries', point, withinMeters, false))
        if(sort === Sort.Distance){
            query.orderBy('distance', 'asc')
        }else{
            query.orderBy('rank', 'desc')
        }
    }
    query.offset(offset || 0)
    query.limit(limit || 20)
    const results = await query
    return results
}