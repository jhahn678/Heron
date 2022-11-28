import { Request } from "express";
import knex, { st } from "../../configs/knex";
import { AutocompleteQuery } from '../../types/Autocomplete'
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AutocompleteQueryError } from "../../utils/errors/AutocompleteQueryError";
import { validateCoords } from "../../utils/validations/coordinates";
import { validateAdminOne } from "../../utils/validations/validateAdminOne";

export const autocompleteWaterbodies = asyncWrapper(async (req: Request<{},{},{},AutocompleteQuery>, res) => {
    
    const { value, lnglat, limit=8 } = req.query;
    if(!value) throw new AutocompleteQueryError('VALUE_REQUIRED')
    
    const query = knex('waterbodies')
    
    const parsedValue = value.split(',').map(x => x.trim())
    const [ name, adminOne ] = parsedValue;
    query.whereILike('name', (name + '%'))
    
    if(parsedValue.length > 1){
        const valid = validateAdminOne(adminOne);
        if(valid) query.whereRaw('? = any(admin_one)', [valid])
    }
    
    if(lnglat && !adminOne && name.length < 8){
        const coords = lnglat.split(',').map(x => parseFloat(x))
        if(validateCoords(coords)){
            const [lng, lat] = coords;
            const point = st.transform(st.setSRID(st.point(lng, lat), 4326), 3857)
            query.select(
                'id', 'name', 'classification', 'admin_one', 
                'admin_two', 'country', 'ccode', 'subregion', 'weight', 
                knex.raw("'WATERBODY' as type"),
                knex.raw('rank_result(simplified_geometries <-> ?, weight, ?) as rank', [point, 300000])
                )
                query.where(st.dwithin('simplified_geometries', point, 300000))
            }
        }else{
            query.select(
                'id', 'name', 'classification', 'admin_one', 
                'admin_two', 'country', 'ccode', 'subregion', 'weight', 
                knex.raw("'WATERBODY' as type"),
                knex.raw('weight as rank')
                )
        }
            
        query.orderByRaw('rank desc')
        query.limit(limit)
        
        const results = await query;
        res.status(200).json(results)
    })