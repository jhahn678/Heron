import { Request } from "express";
import { asyncWrapper } from "../utils/errors/asyncWrapper";
import { validateCoords } from "../utils/validations/coordinates";
import knex, { st } from "../configs/knex";
import { AutocompleteQueryError } from "../utils/errors/AutocompleteQueryError";
import { validateAdminOne } from "../utils/validations/validateAdminOne";
import { CoordinateError } from "../utils/errors/CoordinateError";


interface AutocompleteQuery {
    /** Query value */
    value: string,
    /** Comma seperated longitude,latitude */
    lnglat?: string
    /** @Default 8 */
    limit?: number
}

export const autocompleteGeoplaces = asyncWrapper(async (req: Request<{},{},{},AutocompleteQuery>, res) => {
    
    const { value, lnglat, limit=8 } = req.query;
    if(!value) throw new AutocompleteQueryError('VALUE_REQUIRED')
    
    const query = knex('geoplaces')
    
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
        
        
        
    export const autocompleteAll = asyncWrapper(async (req: Request<{},{},{},AutocompleteQuery>, res, next) => {
            
        const { value, lnglat } = req.query;
        if(!value) throw new AutocompleteQueryError('VALUE_REQUIRED')

        const waterbodies = knex('waterbodies')
        const geoplaces = knex('geoplaces')

        const parsedValue = value.split(',').map(x => x.trim())
        const [ name, adminOne ] = parsedValue;
        waterbodies.whereILike('name', (name + '%'))
        geoplaces.whereILike('name', (name + '%'))
        
        if(lnglat && !adminOne && name.length < 8){
            const coords = lnglat.split(',').map(x => parseFloat(x))
            if(validateCoords(coords)){
                const [lng, lat] = coords;
                const point = st.transform(st.setSRID(st.point(lng, lat), 4326), 3857)
                waterbodies.select(
                    'id', 'name', 'classification', 'admin_one', 
                    'admin_two', 'country', 'ccode', 'subregion', 'weight', 
                    knex.raw("'WATERBODY' as type"),
                    knex.raw('rank_result(simplified_geometries <-> ?, weight, ?) as rank', [point, 300000])
                )
                geoplaces.select('*', 
                    knex.raw("'GEOPLACE' as type"),
                    knex.raw('st_asgeojson(st_transform(geom, 4326))::json as geom'),
                    knex.raw('rank_result(geom <-> ?, weight, ?) as rank', [point, 300000])
                )
                geoplaces.where(st.dwithin('geom', point, 300000))
                waterbodies.where(st.dwithin('simplified_geometries', point, 300000))
            }
        }else{
            waterbodies.select(
                'id', 'name', 'classification', 'admin_one', 
                'admin_two', 'country', 'ccode', 'subregion', 'weight', 
                knex.raw("'WATERBODY' as type"),
                knex.raw('weight as rank')
            )
            geoplaces.select('*', 
                knex.raw('weight as rank'))
                knex.raw("'GEOPLACE' as type"),
                knex.raw('st_asgeojson(st_transform(geom, 4326))::json as geom'
            )
        }

        waterbodies.orderByRaw('rank desc')
        geoplaces.orderByRaw('rank desc')
        waterbodies.limit(8)
        geoplaces.limit(8)

        const waterbodyResults = await waterbodies;
        const geoplaceResults = await geoplaces;

        const sorted = [
            ...waterbodyResults, 
            ...geoplaceResults
            //@ts-ignore
        ].sort((x,y) => y.rank - x.rank)

        res.status(200).json(sorted)
    })

interface LngLatQuery {
    /** Comma seperated longitude,latitude */
    lnglat: string
}

export const nearestWaterbodies = asyncWrapper(async (req: Request<{},{},{},LngLatQuery>, res) => {
    const { lnglat } = req.query;
    if(!lnglat) throw new AutocompleteQueryError('LATLNG_NOT_PROVIDED')
    const coords = lnglat.split(',').map(x => parseFloat(x))
    if(!validateCoords(coords)) throw new CoordinateError('INVALID_COORDINATES')
    const [lng, lat] = coords;
    const point = st.transform(st.setSRID(st.point(lng, lat), 4326), 3857)
    const results = await knex('waterbodies')
        .select('id', 'name', 'classification', 'admin_one', 'admin_two', 'country', 'ccode', 'subregion')
        .where(st.dwithin('simplified_geometries', point, 10000, false))
        .orderByRaw('simplified_geometries <-> ?', [point])
        .limit(4)
    res.status(200).json(results)
})