declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string
        MONGO_URI: string
        JWT_SECRET: string
        PG_HOST: string
        PG_PORT: string
        PG_USER: string
        PG_DATABASE: string
      }
    }
  }
  
export {}