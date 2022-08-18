import { gql } from 'apollo-server-express'

export const typeDef =  gql`
    type Location {
        title: String,
        description: String,
        user: User,
        waterbody: Waterbody,
        media: [LocationMedia]
        geojson: Geojson
    }

    type Geojson {
        type: String,
        geometry: Geometry
    }

    union Geometry = Point | Polygon

    type Point {
        type: String
        coordinates: [Float]
        properties: PointProps
    }

    type PointProps {
        pinColor: String
    }

    type Polygon {
        type: String
        coordinates: [[Float]]
        properties: PolygonProps
    }

    type PolygonProps {
        strokeColor: String
        fillColor: String
    }

    type Query {
        getLocation(id: ID!): Location
        getLocations(ids: [ID]): [Location]
    }

    type Mutation {
        createLocationPoint(location: NewLocationPoint): Location
        createLocationPolygon(location: NewLocationPolygon): Location
        updateLocationDetails(id: ID!, details: LocationDetails): Location
        updateGeojsonPoint(id: ID!, geojson: GeojsonPoint): Location
        updateGeojsonPolygon(id: ID!, geojson: GeojsonPolygon): Location
        addLocationMedia(id: ID!, media: MediaInput!): Location
        removeLocationMedia(id: ID!, mediaId: ID!): Location
        deleteLocation(id: ID!): [Location]
    }

    input NewLocationPoint {
        title: String
        description: String
        waterbody: ID!
        media: [MediaInput]
        coordinates: [Float]!
        pinColor: String
    }

    input NewLocationPolygon {
        title: String
        description: String
        waterbody: ID!
        media: [MediaInput]
        coordinates: [[Float]]!
        strokeColor: String
        fillColor: String
    }

    input LocationDetails {
        title: String,
        description: String
    }

    input GeojsonPoint {
        coordinates: [Float]
        pinColor: String
    }

    input GeojsonPolygon {
        coordinates: [[Float]]
        strokeColor: String
        fillColor: String
    }

`

export const resolver = {
    Query: {
        getLocation: () => {},
        getLocations: () => {},
    },
    Mutation: {
        createLocationPoint: () => {},
        createLocationPolygon: () => {},
        updateLocationDetails: () => {},
        updateGeojsonPoint: () => {},
        updateGeojsonPolygon: () => {},
        addLocationMedia: () => {},
        removeLocationMedia: () => {},
        deleteLocation: () => {}
    },
    Location: {
        user: () => {},
        waterbody: () => {}
    }
}

