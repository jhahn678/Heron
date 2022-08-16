import { IMedia } from "./Media"
import { ILocation } from "./Location"
import { ICatch } from "./Catch"

export interface IWaterbody {
    _id: string
    name: string
    states: [string]
    classification: string
    country: string
    counties: [string]
    ccode: string
    subregion: string
    catches: ICatch[]
    locations: ILocation[]
    media: IMedia[]
}