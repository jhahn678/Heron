import { Geometry } from "geojson"

export interface IWaterbody {
    id: number,
    name: string
    classification: string
    country: string
    subregion: string | null
    ccode: string
    admin_one: string[]
    admin_two: string[]
    is_saved?: boolean
}

export interface IWaterbodyMedia {
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

export interface IGeometry {
    id: number,
    osm_id: number,
    name: string,
    geom: Geometry,
    ccode: string,
    country: string
    admin_one: string,
    waterbody: number
}

export interface IWaterbodyReview {
    id: number
    waterbody: number
    user: number
    rating: number
    text?: string
    created_at: Date
}

export interface NewWaterbodyReview {
    waterbody: number
    rating: number
    text: string
}

export interface WaterbodyReviewUpdate {
    id: number
    rating?: number
    text?: string
}