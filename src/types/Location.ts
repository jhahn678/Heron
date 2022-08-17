import { Point, Polygon, LineString } from "geojson"

export interface ILocation {
    id: number,
    user: number,
    waterbody: string,
    title: string,
    description: string,
    geom: Point | Polygon | LineString
    hexcolor: string
}

export interface LocationMedia {
    id: number,
    user: number,
    location: number,
    key: string,
    url: string,
    created_at: Date
}