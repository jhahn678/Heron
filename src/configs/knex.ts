require('dotenv').config()
import Knex from "knex";
import KnexPostgis from "knex-postgis"; 
import { IUser, UserAvatar, IContact, IPendingContact } from "../types/User";
import { ICatch, CatchMedia } from "../types/Catch";
import { ILocation, LocationMedia } from "../types/Location";
import { ISavedWaterbody, WaterbodyMedia } from "../types/Waterbody";
import camelToSnakeCase from "../utils/transformations/camelToSnakeCase";
const { PG_HERON_CONNECTION } = process.env;

const knex = Knex({
    client: 'pg',
    connection: PG_HERON_CONNECTION,
    pool: { min: 0, max: 25 },
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
        waterbodyMedia: WaterbodyMedia,
        savedWaterbodies: ISavedWaterbody
    }
}
