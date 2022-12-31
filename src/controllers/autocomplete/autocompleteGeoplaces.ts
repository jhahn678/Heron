import { Request } from "express";
import knex, { st } from "../../configs/knex";
import { AutocompletePlaces } from "../../types/Autocomplete";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { validateCoords } from "../../utils/validations/coordinates";
import { validateAdminOne } from "../../utils/validations/validateAdminOne";

export const autocompleteGeoplaces = asyncWrapper(async (req: Request<{},{},{},AutocompletePlaces>, res) => {
    
    const { value, lnglat, limit=8, fclass } = req.query;
    
    const query = knex('geoplaces')

    if(fclass){
        const parsedClasses = fclass.split(',').map(x => x.trim().toUpperCase());
        if(parsedClasses.length) query.whereIn('fclass', parsedClasses)
    }
    
    const parsedValue = value.split(',').map(x => x.trim())
    const [ name, adminOne ] = parsedValue;
    query.whereILike('name', (name + '%'))
    
    if(parsedValue.length > 1){
        const valid = validateAdminOne(adminOne);
        if(valid) query.where('admin_one', valid)
    }
    
    if(lnglat && !adminOne && name.length < 8){
        const coords = lnglat.split(',').map(x => parseFloat(x))
        if(validateCoords(coords)){
            const [lng, lat] = coords;
            const point = st.transform(st.setSRID(st.point(lng, lat), 4326), 3857)
            query.select('*',
            knex.raw('st_asgeojson(st_transform(geom, 4326))::json as geom'),
            knex.raw("'GEOPLACE' as type"),
            knex.raw('rank_result(geom <-> ?, weight, ?) as rank', [point, 300000])
            )
            query.where(st.dwithin('geom', point, 300000))
        }
    }else{
        query.select('*', 
        knex.raw('st_asgeojson(st_transform(geom, 4326))::json as geom'),
        knex.raw("'GEOPLACE' as type"),
        knex.raw('weight as rank')
        )
    }
    
    query.orderByRaw('rank desc')
    query.limit(limit)
    
    const results = await query;
    res.status(200).json(results)
})


