import { Request } from "express";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { RequestError } from "../../utils/errors/RequestError";

interface WaterbodyQuery {
    id: number,
    /** Returns associated geometries as a geojson geometry collection */
    geometries?: string | boolean
}

export const getWaterbody = asyncWrapper(async (req: Request<{},{},{},WaterbodyQuery>, res) => {

    const { id, geometries } = req.query;
    if(!id) throw new RequestError('ID_REQUIRED')

    const query = knex('waterbodies')
        .select(
            'id', 'name', 'classification', 'country', 'ccode',
            'admin_one', 'admin_two', 'subregion', 'weight'
        )
        .where('id', id)
        .first()
    
    if(geometries) {
        query.select(knex.raw(
            '(select st_asgeojson(st_collect(st_transform(geom, 4326))) ' + 
            'from geometries where waterbody = ?)::json as geometries', 
            [id]
        ))
    }

    const waterbody = await query;
    if(!waterbody) throw new RequestError('RESOURCE_NOT_FOUND')
    res.status(200).json(waterbody)
})

