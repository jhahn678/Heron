import { Point } from 'geojson'
import { Knex } from 'knex'


export interface ICatch {
    id: number,
    user: number,
    waterbody: string,
    geom: Point | Knex.Raw,
    title: string,
    description: string,
    species: string,
    length: number,
    length_unit: 'IN' | 'CM',
    weight: number,
    weight_unit:  'LB' | 'KG' | 'OZ' | 'G'
    rig: string,
    created_at: Date,
    updated_at: Date
} 

export interface CatchMedia {
    id: number
    key: string
    url: string
    user: number
    catch: number,
    created_at: string
}

export interface NewCatchBuilder {
    user: number,
    waterbody: string,
    /** FORMAT:   ST_SetSRID(ST_Point(lng, lat), 4326) */
    geom?: any
    title?: string,
    description?: string,
    species?: string
    weight?: number,
    weight_unit?:  'LB' | 'KG' | 'OZ' | 'G'
    length?: number,
    length_unit?: 'IN' | 'CM',
    rig?: string
}


export type CatchUpdateBuilder = Omit<NewCatchBuilder, 'user' | 'waterbody' | 'geom'>