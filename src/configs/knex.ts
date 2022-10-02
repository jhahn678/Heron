require('dotenv').config()
import Knex from "knex";
import KnexPostgis from "knex-postgis"; 
import { IUser, UserAvatar, IContact, IUserFollowers } from "../types/User";
import { ICatch, ICatchFavorite, ICatchMedia } from "../types/Catch";
import { ILocation, ILocationFavorite, ILocationMedia, ISavedLocation } from "../types/Location";
import { IGeometry, ISavedWaterbody, IWaterbody, IWaterbodyMedia, IWaterbodyReview } from "../types/Waterbody";
import { IRefreshToken } from "../types/Auth";
import camelToSnakeCase from "../utils/transformations/camelToSnakeCase";
const { PG_DB_CONNECTION } = process.env;

const knex = Knex({
    client: 'pg',
    connection: PG_DB_CONNECTION,
    pool: { min: 0, max: 25 },
    wrapIdentifier: (value, origImpl) => origImpl(camelToSnakeCase(value))
})

export const st = KnexPostgis(knex)

export default knex;

declare module 'knex/types/tables' {
    interface Tables {
        users: IUser,
        userAvatars: UserAvatar,
        contacts: IContact,
        catches: ICatch,
        catchMedia: ICatchMedia,
        catchFavorites: ICatchFavorite
        locations: ILocation,
        locationMedia: ILocationMedia,
        savedLocations: ISavedLocation
        locationFavorites: ILocationFavorite,
        waterbodies: IWaterbody,
        waterbodyMedia: IWaterbodyMedia,
        waterbodyReviews: IWaterbodyReview
        savedWaterbodies: ISavedWaterbody,
        geometries: IGeometry,
        refreshTokens: IRefreshToken,
        userFollowers: IUserFollowers
    }
}
