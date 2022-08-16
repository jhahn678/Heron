import { IUser } from "./User"
import { IMedia } from "./Media"
import { IWaterbody } from './Waterbody'
import { Point, Polygon, LineString } from "geojson"

export interface ILocation {
    title: string,
    description: string,
    user: IUser[],
    waterbody: IWaterbody[]
    media: IMedia[]
    geojson: Point | Polygon | LineString
}