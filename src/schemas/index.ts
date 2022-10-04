import {
    resolver as userResolver,
    typeDef as userTypeDef
} from './user'
import {
    typeDef as mediaTypeDef,
    resolver as mediaResolver
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
    typeDef as geojsonTypeDef,
    resolver as geojsonResolver
} from './geojson'
import {
    typeDef as waterbodyReviewTypeDef,
    resolver as waterbodyReviewResolver
} from './waterbodyReview'

import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive';

const typesArray = [
    ...scalarTypeDefs,
    geojsonTypeDef,
    constraintDirectiveTypeDefs,
    enumTypeDef,
    userTypeDef,
    mediaTypeDef,
    catchTypeDef,
    locationTypeDef,
    waterbodyTypeDef,
    waterbodyReviewTypeDef
]

const resolversArray = [
    enumResolver,
    geojsonResolver,
    userResolver,
    catchResolver,
    waterbodyResolver,
    locationResolver,
    waterbodyReviewResolver,
    mediaResolver
]

export const typeDefs = mergeTypeDefs(typesArray)
export const resolvers = mergeResolvers(resolversArray)