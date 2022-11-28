import { Request } from "express";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { validateAdminOne } from "../../utils/validations/validateAdminOne";

        
interface DistinctNameQuery { 
    value: string,
    classifications?: string,
    admin_one?: string
}

export const searchDistinctWaterbodyName = asyncWrapper(async(req: Request<{},{},{},DistinctNameQuery>, res) => {
    
    const { value, classifications, admin_one } = req.query;

    const query = knex('waterbodies').distinct('name')
    if(value) query.whereILike('name',(value + '%'))

    if(classifications){
        const split = classifications
            .split(',')
            .map(x => x.trim().toLowerCase())
        query.whereIn('classification', split)
    }

    if(admin_one){
        const valid = admin_one.split(',')
            .map(x => validateAdminOne(x.trim()))
            .filter(x => x !== null)
        if(valid.length > 0){
            query.whereRaw(`admin_one && array[${valid.map(() => '?').join(',')}]::varchar[]`, valid)
        }
    }

    const results = await query;

    res.status(200).json(results.map(x => x.name))
})