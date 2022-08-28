declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string
        JWT_SECRET: string
        PG_NA_WATERBODIES_CONNECTION: string
        PG_HERON_CONNECTION: string
        S3_ACCESS_KEY: string
        S3_SECRET_KEY: string
        S3_BUCKET_NAME: string
        AWS_REGION: string
        S3_BASE_URL: string
      }
    }
  }
  
export {}