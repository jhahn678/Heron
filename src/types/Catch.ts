import { Point } from 'geojson'
import knex, { Knex } from 'knex'
import { IMedia } from './Media'


export interface ICatch {
    id: number,
    user: number,
    waterbody: number,
    geom: Point | Knex.Raw | null,
    title: string | null,
    description: string | null,
    species: string | null,
    length: number | null,
    weight: number | null,
    rig: string | null,
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
    rig?: string,
    created_at?: Date
}


export interface CatchUpdateBuilder {
    waterbody?: number | undefined
    title?: string | undefined | null
    description?: string | undefined | null
    weight?: number | undefined | null
    length?: number | undefined | null
    species?: string | undefined | null
    rig?: string | undefined | null
    geom?: Knex.Raw | undefined | null
    created_at?: Date
}