import knex from "../../../configs/knex";
import { MediaType, QueryResolvers } from "../../../types/graphql";

export const getMedia: QueryResolvers['media'] = async (_, { id, type }) => {
    let table;
    switch(type){
        case MediaType.Catch:
            table = 'catchMedia';
            break;
        case MediaType.Location:
            table = 'locationMedia';
            break;
        case MediaType.Waterbody:
            table = 'waterbodyMedia';
            break;
        case MediaType.MapLocation:
            table = 'locationMapImages'
            break;
        case MediaType.MapCatch:
            table = 'catchMapImages'
            break;
    }
    return (await knex(table).where({ id }).first())
}