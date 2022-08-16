import { gql } from 'apollo-server-express'

export const typeDef =  gql`

    type Catch {
        id: ID,
        user: User,
        waterbody: Waterbody,
        location: Point,
        title: String,
        description: String,
        species: String,
        length: Length,
        weight: Weight,
        rig: String,
        media: [Media]
        createdAt: DateTime,
        updatedAt: DateTime
    }

    type Length {
        value: Float!,
        unit: LengthUnit!
    }

    enum LengthUnit{
        IN
        CM
    }

    type Weight {
        value: Float!,
        unit: WeightUnit!
    }
    
    enum WeightUnit {
        LB
        OZ
        KG
        G
    }

    type Point {
        type: String,
        coordinates: [Float]
    }

    type Query {
        getCatch(id: ID!): Catch
        getCatches(ids: [ID]): [Catch]
    }

    type Mutation {
        createCatch(catch: NewCatch): Catch
        updateCatchDetails(id: ID!, details: CatchDetails): Catch
        updateCatchLocation(id: ID!, coordinates: [Float]): Catch
        addCatchMedia(id: ID!, media: [MediaInput]): Catch
        removeCatchMedia(id: ID!, mediaId: ID!): Catch
        deleteCatch(id: ID!): [Catch]
    }

    input NewCatch {
        waterbody: ID!
        coordinates: [Float]
        title: String,
        description: String,
        species: String
        weight: WeightInput
        length: LengthInput
        rig: String
        media: [MediaInput]
    }

    input LengthInput {
        value: Float!,
        unit: LengthUnit!
    }

    input WeightInput {
        value: Float!,
        unit: WeightUnit!
    }

    input CatchDetails {
        title: String,
        description: String,
        species: String,
        weight: WeightInput,
        length: LengthInput,
        rig: String
    }



`

export const resolver = {
    Query: {
        getCatch: () => {},
        getCatches: () => {}
    },
    Mutation: {
        createCatch: () => {},
        updateCatchDetails: () => {},
        updateCatchLocation: () => {},
        addCatchMedia: () => {},
        removeCatchMedia: () => {},
        deleteCatch: () => {}
    },
    Catch: {
        user: () => {},
        waterbody: () => {}
    }
}