import { Request } from "express"
import knex, { st } from "../../configs/knex"
import { asyncWrapper } from "../../utils/errors/asyncWrapper"
import { CoordinateError } from "../../utils/errors/CoordinateError"
import { milesToMeters } from "../../utils/transformations/milesToMeters"
import { validateCoords } from "../../utils/validations/coordinates"
import { validateAdminOne } from "../../utils/validations/validateAdminOne"

interface WaterbodiesQuery {
    /** case-insensitive value */
    value?: string
    /** Comma seperated classifications */
    classifications?: string
    /** Comma seperated admin_one values -- precedence over states */
    admin_one?: string
    /** Comma seperated admin_one values */
    states?: string
    /** minimum search weight returned*/
    minWeight?: string
    /** maximum search weight returned */
    maxWeight?: string
    /** two letter country code -- precedence over country*/
    ccode?: string
    /** country name */
    country?: string,
    /** subregion name -- only valid for US */
    subregion?: string
    /** Boolean value to include geometries or not @default false*/
    /** Returns geometries as a geojson geometry collection */
    geometries: boolean,
    /**Comma seperated longitude, latitude */
    lnglat?: string,
    /** Number of miles to search within @default 50 */
    within: number
    /** Method to sort by  @default rank */
    sort: 'distance' | 'rank'
    /** page number @default 1 */
    page: number
    /** page size @default 50 */
    limit: number
}

export const getWaterbodies = asyncWrapper(async(req: Request<{},{},{},WaterbodiesQuery>, res) => {
    const { 
        value, classifications, admin_one, states, 
        minWeight, maxWeight, ccode, subregion, lnglat,
        geometries=false, within=50, sort='rank', page=1, limit=20
    } = req.query;

    let isUsingDistance = false;

    const query = knex('waterbodies')

    if(value) query.whereILike("name", value + '%')

    if(classifications){
        const split = classifications.split(',')
            .map(x => x.trim())
        query.whereIn('classification', split)
    }

    if(admin_one){
        const split = admin_one.split(',')
            .map(x => validateAdminOne(x.trim()))
            .filter(x => x !== null)
        if(split.length > 0){
            query.whereRaw(`admin_one && array[${split.map(() => '?').join(',')}]::varchar[]`, split)
        }
    }else if(states){
        const split = states.split(',')
            .map(x => validateAdminOne(x.trim()))
            .filter(x => x !== null)
        if(split.length > 0){
            query.whereRaw(`admin_one && array[${split.map(() => '?').join(',')}]::varchar[]`, split)
        }
    }

    if(maxWeight) query.where('weight', '<=', maxWeight)
    if(minWeight) query.where('weight', '>=', minWeight)

    if(ccode) query.where('ccode', ccode )
    if(subregion) query.where('subregion', subregion)

    if(lnglat){
        const coords = lnglat.split(',').map(x => parseFloat(x))
        if(!validateCoords(coords)){
            throw new CoordinateError('INVALID_COORDINATES')
        }
        isUsingDistance = true;
        const [lng, lat] = coords; 
        const point = st.transform(st.setSRID(st.point(lng, lat), 4326), 3857)
        const dist = within ? milesToMeters(within) : 80000 //~50 miles
        query.select('id', 'name', 'classification', 'country', 'ccode', 
            'admin_one', 'admin_two', 'subregion', 'weight',
            knex.raw('simplified_geometries <-> ? as distance', point), 
            knex.raw('rank_result(simplified_geometries <-> ?, weight, ?) as rank', [point, dist])
        )
        query.where(st.dwithin('simplified_geometries', point, dist, false))
    }else{
        query.select('id', 'name', 'classification', 'country', 'ccode', 'admin_one', 
            'admin_two', 'subregion', 'weight', { rank: 'weight' }
        )
    }

    if(geometries){
        query.select(knex.raw(
            '(select st_asgeojson(st_transform(st_collect(geometries.geom), 4326))' +  
            ' from geometries where geometries.waterbody = waterbodies.id)::json as geometries'
        ))
    }

    query.limit(limit + 1) //Fetch one more than requested to determine if there's next page
    query.offset((page - 1) * limit)

    if(sort && sort === 'distance' && isUsingDistance === true){
        query.orderBy('distance', 'asc')
    }else{
        query.orderBy('rank', 'desc')
    }

    const results = await query;
    const hasNext = results.length === (limit + 1)

    res.status(200).json({
        metadata: {
            next: results.length ? hasNext : false, 
            page: page, 
            limit: limit
        },
        data: results.length === 0 ? [] : hasNext 
            ? results.slice(0,-1) : results
    })

})
