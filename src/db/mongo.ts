import { MongoDataSource } from "apollo-datasource-mongodb";
import { Context } from "../types/context";
import { IWaterbody } from "../types/Waterbody";

export class Waterbodies extends MongoDataSource<IWaterbody, Context>{
    async getWaterbody(_id: string){
        return (await this.findOneById(_id, { ttl: 60 }))
    }
}