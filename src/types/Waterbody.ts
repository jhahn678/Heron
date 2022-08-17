import { GeometryCollection } from "geojson"

export interface IWaterbody {
    _id: string,
    name: string
    states: string[]
    classification: string
    weight: number
    country: string
    counties: string[]
    ccode: string
    subregion: string
    geometries: string[]
    simplified_geometries: GeometryCollection
}

export interface WaterbodyMedia {
    id: number,
    waterbody: string,
    user: number,
    key: string,
    url: string,
    created_at: Date
}