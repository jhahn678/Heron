import { IMedia } from "./Media"
import { IUser } from './User'
import { Point } from 'geojson'

export interface ICatch {
    _id: string,
    user: string,
    waterbody: string,
    location: Point,
    title: string,
    description: string,
    species: string,
    length: Length,
    weight: Weight,
    rig: string,
    media: IMedia[]
    createdAt: Date,
    updatedAt: Date
} 

type Length = {
    value: number,
    unit: 'IN' | 'CM'
}

type Weight = {
    value: number,
    unit: 'LB' | 'KG' | 'OZ' | 'G'
}