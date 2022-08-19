import { Waterbodies } from "../configs/mongo"

export interface DataSources {
    waterbodies: Waterbodies
}

export interface Context {
    /** ID of the user if they are authenticated */
    auth: number,
    dataSources: DataSources 
}