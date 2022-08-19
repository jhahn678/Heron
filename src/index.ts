require('dotenv').config()
import http from 'http';
import express from 'express';
import cors from 'cors'
import routes from './routes'
import { MongoClient } from 'mongodb';
import { Waterbodies } from './configs/mongo';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { typeDefs, resolvers } from './schemas'
import { verifyAuthHeader } from './utils/auth/token';
import { constraintDirective } from 'graphql-constraint-directive';

const PORT = process.env.PORT || 4000

async function startServer(){
    const app = express()
    const httpServer = http.createServer(app)

    const client = new MongoClient(process.env.MONGO_URI!)
    client.connect().then(() => console.log('🚀 Connected to McMongoDB'))

    const schema = constraintDirective()(makeExecutableSchema({ typeDefs, resolvers }))

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: 'bounded',
        dataSources: () => ({
            waterbodies: new Waterbodies(client.db().collection('us_waterbodies'))
        }),
        context: ({ req }) => {
            const { authorization } = req.headers;
            const id = verifyAuthHeader(authorization)
            return { auth: id }
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
    });

    await server.start();
    server.applyMiddleware({
        app, path: '/graphql'
    })

    httpServer.listen(PORT, () => {
        console.log(`🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
    })

    app.use(cors())
    app.use(express.json())
    app.use('/', routes)
}

startServer()
