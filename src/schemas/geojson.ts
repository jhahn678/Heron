import { gql, UserInputError } from "apollo-server-core";
import { GraphQLScalarType } from "graphql";

import {
    MultiLineString,
    MultiPolygon,
    Geometry,
    GeometryCollection,
    Point,
    Polygon,
    LineString
} from 'graphql-geojson-scalar-types'

//Only used when coming from database so loose validation is fine.
//Just for ensuring valid geometry type
const validateLocationGeometry = (value: any) => {
    console.log({
        value: value,
        isObject: typeof value === 'object',
        notArray: !Array.isArray(value),
        notNull: value !== null,
        hasType: value.hasOwnProperty('type'),
        pointOrPolygon: (value.type === 'Point' || value.type === 'Polygon'),
        hasCoordinates: value.hasOwnProperty('coordinates'),
        coordsArray: Array.isArray(value.coordinates)
    })
    if(
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null &&
        value.hasOwnProperty('type') &&
        (value.type === 'Point' || value.type === 'Polygon') &&
        value.hasOwnProperty('coordinates') &&
        Array.isArray(value.coordinates)
    ) return value;
    throw new UserInputError('Invalid location geometry')
}

export const typeDef = gql`
    scalar MultiLineString
    scalar MultiPolygon
    scalar GeometryCollection
    scalar Geometry
    scalar Point
    scalar Polygon
    scalar LineString
`

export const resolver = {
    MultiLineString,
    MultiPolygon,
    Geometry,
    GeometryCollection,
    Point,
    Polygon,
    LineString,
}