import { Request } from "express";
import knex from "../configs/knex";
import { asyncWrapper } from "../utils/errors/asyncWrapper";
import { RequestError } from "../utils/errors/RequestError";
import { validateAdminOne } from "../utils/validations/validateAdminOne";

interface GetDuplicatesQuery {
    name: string
    classification?: string
    admin_one?: string
}

export const getWaterbodiesByName = asyncWrapper(async(req: Request<{},{},{},GetDuplicatesQuery>, res) => {
    
    const { name, classification, admin_one } = req.query;
    
    if(!name) throw new RequestError('NAME_REQUIRED')
    
    const query = knex('waterbodies').where('name', name)

    if(classification){
        const split = classification.split(',')
            .map(x => x.trim().toLowerCase())
        query.whereIn('classification', split)
    }

    if(admin_one){
        const split = admin_one.split(',')
            .map(x => validateAdminOne(x.trim()))
            .filter(x => x !== null)
        query.whereRaw(`admin_one && array[${split.map(() => '?').join(',')}]::varchar[]`, split)
    }

    query.select(
        'id', 'name', 'classification', 'country', 'ccode', 
        'admin_one', 'admin_two', 'subregion', 'weight', 
        knex.raw(
            '(select st_asgeojson(st_transform(st_collect(geometries.geom), 4326))' +  
            ' from geometries where geometries.waterbody = waterbodies.id)::json as geometries'
        ), knex.raw(
            '(select count(geometries.geom) from geometries where geometries.waterbody = ' +
            'waterbodies.id) as total_geometries'
        )
    )

    query.orderByRaw('total_geometries desc')
    
    const waterbodies = await query;
    res.status(200).json(waterbodies)
})
