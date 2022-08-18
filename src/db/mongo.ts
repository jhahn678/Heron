import { MongoDataSource } from "apollo-datasource-mongodb";
import { Context } from "../types/context";
import { IWaterbody } from "../types/Waterbody";
import { InputMaybe } from "../types/graphql";

export interface GetWaterbodiesArgs {
    ids?: InputMaybe<string>[]
    offset?: number
    limit?: number
}

export class Waterbodies extends MongoDataSource<IWaterbody, Context>{
    async getWaterbody(_id: string){
        return (await this.findOneById(_id, { ttl: 60 }))
    }
    async getWaterbodies({ ids, offset=0, limit=20 }: GetWaterbodiesArgs){
        if(ids && ids.length > 0){ 
            return (await this.findManyByIds(ids as string[], { ttl: 60 }))
        }else{
            return (await this.collection.find().skip(offset).limit(limit).toArray())
        }
    }
} 