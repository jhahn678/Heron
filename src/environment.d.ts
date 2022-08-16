declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: number
        MONGO_DB_URI: string
        JWT_SECRET: string
      }
    }
}


export {}