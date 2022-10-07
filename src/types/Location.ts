import { Point, Polygon, LineString } from "geojson"
import { Knex } from "knex"
import { Privacy } from "./graphql"

export interface ILocation {
    id: number,
    privacy: Privacy
    user: number,
    waterbody: number,
    title: string,
    description: string,
    geom: Point | Polygon | LineString
    map_image?: ILocationMedia
    nearest_place: string
    hexcolor: string
    is_saved?: boolean
    is_favorited?: boolean
    total_favorites?: number,
}

export interface ILocationMedia {
    id: number,
    user: number,
    location: number,
    key: string,
    url: string,
    created_at: Date
}

export interface ILocationFavorite {
    location: number
    user: number
}

export interface ISavedLocation {
    location: number
    user: number
    created_at: Date
}

export interface NewLocationObj {
    user: number,
    waterbody: number,
    privacy: Privacy
    title?: string,
    description?: string,
    geom?: Knex.Raw,
    hexcolor?: string
}

export interface LocationUpdate {
    title?: string, 
    description?: string, 
    privacy?: Privacy, 
    hexcolor?: string, 
    geom?: Knex.Raw,
}

