require('dotenv').config()
import Knex from "knex";
import KnexPostgis from "knex-postgis"; 
import { IUser, UserAvatar, IContact, IPendingContact } from "../types/User";
import { ICatch, CatchMedia } from "../types/Catch";
import { ILocation, LocationMedia } from "../types/Location";
import { WaterbodyMedia } from "../types/Waterbody";
import camelToSnakeCase from "../utils/transformations/camelToSnakeCase";
import snakeToCamelCase from "../utils/transformations/snakeToCamelCase";

const knex = Knex({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT!),
        database: process.env.PG_DATABASE
    },
    pool: { min: 0, max: 7 },
    // postProcessResponse: (result) => {
    //     if (Array.isArray(result)) {
    //         return result.map(row => snakeToCamelCase(row));
    //     } else {
    //         return snakeToCamelCase(result);
    //     }
    // },
    wrapIdentifier: (value, origImpl) => origImpl(camelToSnakeCase(value)),

})

export const st = KnexPostgis(knex)

export default knex;

declare module 'knex/types/tables' {
    interface Tables {
        users: IUser,
        userAvatars: UserAvatar,
        contacts: IContact,
        pendingContacts: IPendingContact,
        catches: ICatch,
        catchMedia: CatchMedia,
        locations: ILocation,
        locationMedia: LocationMedia,
        waterbodyMedia: WaterbodyMedia
    }
}
