import { SQLDataSource } from "datasource-sql";
import { Knex } from "knex";
import { Context } from "../types/context";
import { InputMaybe } from "../types/graphql";
import { IWaterbody } from "../types/Waterbody";
require('dotenv').config();
const { PG_NA_WATERBODIES_CONNECTION } = process.env;

export interface GetWaterbodiesArgs {
    ids?: InputMaybe<number>[]
    offset?: number
    limit?: number
}

export class Waterbodies extends SQLDataSource<Context>{
    async getWaterbody(id: number){
        const result = await this.knex<IWaterbody>('waterbodies')
            .select(
                'id', 'name', 'classification', 
                'ccode', 'country', 'admin_one', 
                'admin_two', 'subregion'
            )
            .where({ id })
            .first()
            //@ts-ignore
            .cache(60)
        return result;
    }
    async getWaterbodies({ ids, offset=0, limit=20 }: GetWaterbodiesArgs){
        if(ids && ids.length > 0){ 
            const results = await this.knex<IWaterbody>('waterbodies')
                .select(
                    'id', 'name', 'classification', 
                    'ccode', 'country', 'admin_one', 
                    'admin_two', 'subregion'
                )
                //@ts-ignore
                .whereIn('id', ids)
                .offset(offset)
                .limit(limit)
                //@ts-ignore
                .cache(60)
            return results;
        }else{
            const results = await this.knex<IWaterbody>('waterbodies')
                .select(
                    'id', 'name', 'classification', 
                    'ccode', 'country', 'admin_one', 
                    'admin_two', 'subregion'
                )
                .offset(offset)
                .limit(limit)
                //@ts-ignore
                .cache(60)
            return results
        }
    }
} 

export const knexConfig: Knex.Config = {
    client: 'pg',
    connection: PG_NA_WATERBODIES_CONNECTION,
    pool: { min: 0, max: 50 }
}
