require('dotenv').config()
import Knex from "knex";
import KnexPostgis from "knex-postgis"; 
import { IGeoplace } from '../types/Geoplace'
import { IPasswordResetToken, IRefreshToken } from "../types/Auth";
import { ICatch, ICatchFavorite, ICatchMedia } from "../types/Catch";
import { IUser, UserAvatar, IContact, IUserFollowers } from "../types/User";
import { ILocation, ILocationFavorite, ILocationMedia, ISavedLocation } from "../types/Location";
import { IGeometry, ISavedWaterbody, IWaterbody, IWaterbodyMedia, IWaterbodyReview } from "../types/Waterbody";
import camelToSnakeCase from "../utils/transformations/camelToSnakeCase";
const { PG_HOST, PG_PORT, PG_DBNAME, PG_PASSWORD, PG_USER } = process.env;

const knex = Knex({
    client: 'pg',
    connection: {
        host: PG_HOST,
        port: PG_PORT as unknown as number,
        user: PG_USER,
        password: PG_PASSWORD,
        database: PG_DBNAME
    },
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
        catchMapImages: ICatchMedia
        catchFavorites: ICatchFavorite
        locations: ILocation,
        locationMedia: ILocationMedia,
        locationMapImages: ILocationMedia
        savedLocations: ISavedLocation
        locationFavorites: ILocationFavorite,
        waterbodies: IWaterbody,
        waterbodyMedia: IWaterbodyMedia,
        waterbodyReviews: IWaterbodyReview
        savedWaterbodies: ISavedWaterbody,
        geometries: IGeometry,
        geoplaces: IGeoplace,
        refreshTokens: IRefreshToken,
        userFollowers: IUserFollowers,
        passwordResetTokens: IPasswordResetToken
    }
}
