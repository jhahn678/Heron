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
    hexcolor: string
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

export interface NewLocationObj {
    user: number,
    waterbody: number,
    privacy: Privacy
    title?: string,
    description?: string,
    geom?: Knex.Raw,
    hexcolor?: string
}
