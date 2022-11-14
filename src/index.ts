require('dotenv').config()
import http from 'http';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path'
import routes from './routes'
// import redis from './configs/redis';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { typeDefs, resolvers } from './schemas'
import { verifyAccessToken } from './utils/auth/token';
import { constraintDirective } from 'graphql-constraint-directive';

const PORT = process.env.PORT || 4000

async function startServer(){

    // await redis.connect()
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, '..', 'public')))
    app.use('/', routes)
    const httpServer = http.createServer(app)

    const schema = constraintDirective()(makeExecutableSchema({ typeDefs, resolvers }))

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: 'bounded',
        context: ({ req }) => {
            const { authorization } = req.headers;
            const { ACCESS_TOKEN } = req.cookies;
            if(typeof authorization === 'string' && authorization.startsWith('Bearer ')){
                const token = authorization.split(' ')[1]
                const decoded = verifyAccessToken(token)
                return { auth: decoded.id }
            }else if(ACCESS_TOKEN){
                const decoded = verifyAccessToken(ACCESS_TOKEN)
                return { auth: decoded.id }
            }
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' })

    httpServer.listen(PORT, () => {
        console.log(`🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
    })
}

startServer()
