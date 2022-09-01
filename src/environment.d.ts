declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string
        JWT_SECRET: string
        ACCESS_TOKEN_SECRET: string
        REFRESH_TOKEN_SECRET: string
        PG_NA_WATERBODIES_CONNECTION: string
        PG_HERON_CONNECTION: string
        PG_DB_CONNECTION: string
        S3_ACCESS_KEY: string
        S3_SECRET_KEY: string
        S3_BUCKET_NAME: string
        S3_BASE_URL: string
        SES_SMTP_USERNAME: string
        SES_SMTP_PASSWORD: string
        SES_ACCESS_KEY: string
        SES_SECRET_KEY: string
        AWS_REGION: string
      }
    }
  }
  
export {}