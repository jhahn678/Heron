import { Point } from 'geojson'
import { Knex } from 'knex'
import { IMedia } from './Media'


export interface ICatch {
    id: number,
    user: number,
    waterbody: number,
    geom: Point | Knex.Raw,
    title: string,
    description: string,
    species: string,
    length: number,
    weight: number,
    rig: string,
    map_image?: ICatchMedia
    created_at: Date,
    updated_at: Date
    is_favorited?: boolean
    total_favorites?: number
} 

export interface ICatchMedia {
    id: number
    key: string
    url: string
    user: number
    catch: number,
    created_at: string
}

export interface ICatchFavorite {
    catch: number
    user: number
}

export interface NewCatchBuilder {
    user: number,
    waterbody?: number,
    /** FORMAT:   ST_SetSRID(ST_Point(lng, lat), 4326) */
    geom?: any
    title?: string,
    description?: string,
    species?: string
    weight?: number,
    length?: number,
    rig?: string
}


export type CatchUpdateBuilder = Omit<NewCatchBuilder, 'user' | 'waterbody' | 'geom'>