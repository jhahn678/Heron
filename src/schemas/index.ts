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
import { 
    typeDef as enumTypeDef,
    resolver as enumResolver
} from './enums'
import {
    typeDef as GeoJsonTypeDef,
    resolver as geojsonResolver
} from './geojson'

import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive';

const typesArray = [
    ...scalarTypeDefs,
    constraintDirectiveTypeDefs,
    enumTypeDef,
    userTypeDef,
    pendingContactTypeDef,
    mediaTypeDef,
    catchTypeDef,
    locationTypeDef,
    waterbodyTypeDef,
    GeoJsonTypeDef
]

const resolversArray = [
    enumResolver,
    userResolver,
    pendingContactResolver,
    catchResolver,
    waterbodyResolver,
    locationResolver,
    geojsonResolver
]

export const typeDefs = mergeTypeDefs(typesArray)
export const resolvers = mergeResolvers(resolversArray)