import { AllGeoJSON } from "@turf/helpers"
import { GeometryCollection } from "geojson"

export interface IWaterbody {
    id: number,
    name: string
    classification: string
    weight: number
    country: string
    subregion: string | null
    ccode: string
    admin_one: string[]
    admin_two: string[]
    simplified_geometries: GeometryCollection
}

export interface IWaterbodyWithGeometries extends IWaterbody{
    geometries: AllGeoJSON[]
}

export interface WaterbodyMedia {
    id: number,
    waterbody: number,
    user: number,
    key: string,
    url: string,
    created_at: Date
}

export interface ISavedWaterbody {
    user: number,
    waterbody: number
}

export interface NewWaterbodyMedia {
    waterbody: number,
    user: number,
    key: string,
    url: string
}