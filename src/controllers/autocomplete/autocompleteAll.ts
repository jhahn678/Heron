import { Request } from "express";
import knex, { st } from "../../configs/knex";
import { AutocompleteQuery } from "../../types/Autocomplete";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AutocompleteQueryError } from "../../utils/errors/AutocompleteQueryError";
import { validateCoords } from "../../utils/validations/coordinates";

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