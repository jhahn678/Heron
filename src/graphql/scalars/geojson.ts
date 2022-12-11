import { gql } from "apollo-server-core";
import {
    MultiLineString,
    MultiPolygon,
    Geometry,
    GeometryCollection,
    Point,
    Polygon,
    LineString
} from 'graphql-geojson-scalar-types'



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