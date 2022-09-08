require('dotenv').config()
import Knex from "knex";
import KnexPostgis from "knex-postgis"; 
import { IUser, UserAvatar, IContact, IPendingContact } from "../types/User";
import { ICatch, CatchMedia } from "../types/Catch";
import { ILocation, LocationMedia } from "../types/Location";
import { IGeometry, ISavedWaterbody, IWaterbody, IWaterbodyReview, WaterbodyMedia } from "../types/Waterbody";
import { IRefreshToken } from "../types/Auth";
import camelToSnakeCase from "../utils/transformations/camelToSnakeCase";
const { PG_DB_CONNECTION } = process.env;

const knex = Knex({
    client: 'pg',
    connection: PG_DB_CONNECTION,
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
        savedWaterbodies: ISavedWaterbody,
        waterbodies: IWaterbody,
        geometries: IGeometry,
        refreshTokens: IRefreshToken,
        waterbodyReviews: IWaterbodyReview
    }
}
