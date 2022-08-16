import {
    resolver as userResolver,
    typeDef as userTypeDef
} from './user'
import {
    resolver as pendingContactResolver,
    typeDef as pendingContactTypeDef
} from './pendingContact'
import {
    typeDef as mediaTypeDef
} from './media'
import {
    typeDef as catchTypeDef,
    resolver as catchResolver
} from './catch'
import {
    typeDef as locationTypeDef,
    resolver as locationResolver
} from './location'
import {
    typeDef as waterbodyTypeDef,
    resolver as waterbodyResolver
} from './waterbody'

import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";


const typesArray = [
    ...scalarTypeDefs,
    userTypeDef,
    pendingContactTypeDef,
    mediaTypeDef,
    catchTypeDef,
    locationTypeDef,
    waterbodyTypeDef
]

const resolversArray = [
    userResolver,
    pendingContactResolver,
    catchResolver,
    locationResolver,
    waterbodyResolver
]

export const typeDefs = mergeTypeDefs(typesArray)
export const resolvers = mergeResolvers(resolversArray)