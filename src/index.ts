require('dotenv').config()
import http from 'http';
import express from 'express';
import cors from 'cors'
import routes from './routes'
import { ApolloServer } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { typeDefs, resolvers } from './schemas'

const PORT = process.env.PORT || 4000

async function startServer(){
    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
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
