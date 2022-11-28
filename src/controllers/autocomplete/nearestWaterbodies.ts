import { Request } from "express";
import knex, { st } from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AutocompleteQueryError } from "../../utils/errors/AutocompleteQueryError";
import { CoordinateError } from "../../utils/errors/CoordinateError";
import { validateCoords } from "../../utils/validations/coordinates";

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