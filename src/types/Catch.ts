import { Point } from 'geojson'

export interface ICatch {
    id: number,
    user: number,
    waterbody: string,
    geom: Point,
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
    created_at: string
}
