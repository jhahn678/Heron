import { Catch } from './Catch'
import { Location } from './Location'
import { Media } from './Media'
import { User } from "./User"
import { Waterbody } from './Waterbody'
import { WaterbodyReview } from "./WaterbodyReview"
import { enums } from './enums'
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive';
import { resolver as geoJsonResolver, typeDef as geojsonTypeDef } from './scalars/geojson'

const typesArray = [
    ...scalarTypeDefs,
    geojsonTypeDef,
    constraintDirectiveTypeDefs,
    enums.typeDef,
    User.typeDef,
    Media.typeDef,
    Catch.typeDef,
    Location.typeDef,
    Waterbody.typeDef,
    WaterbodyReview.typeDef
]

const resolversArray = [
    enums.resolver,
    geoJsonResolver,
    User.resolver,
    Catch.resolver,
    Waterbody.resolver,
    Location.resolver,
    WaterbodyReview.resolver,
    Media.resolver
]

export const typeDefs = mergeTypeDefs(typesArray)
export const resolvers = mergeResolvers(resolversArray)
