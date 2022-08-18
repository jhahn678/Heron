import { MongoDataSource } from "apollo-datasource-mongodb"
import { IWaterbody } from "./Waterbody"

export interface DataSources {
    waterbodies: MongoDataSource<IWaterbody, Context>
}

export interface Context {
    /** ID of the user if they are authenticated */
    auth: number,
    dataSources: DataSources 
}