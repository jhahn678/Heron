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
        S3_ACCESS_KEY: string
        S3_SECRET_KEY: string
        S3_BUCKET_NAME: string
        AWS_REGION: string
        S3_BASE_URL: string
      }
    }
  }
  
export {}