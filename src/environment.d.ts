declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string
        JWT_SECRET: string
        ACCESS_TOKEN_SECRET: string
        REFRESH_TOKEN_SECRET: string
        PG_HOST: string
        PG_PORT: number
        PG_USER: string
        PG_PASSWORD: string
        PG_DBNAME: string
        S3_ACCESS_KEY: string
        S3_SECRET_KEY: string
        S3_BUCKET_NAME: string
        S3_BASE_URL: string
        SES_SMTP_USERNAME: string
        SES_SMTP_PASSWORD: string
        SES_ACCESS_KEY: string
        SES_SECRET_KEY: string
        AWS_REGION: string
        GOOGLE_EXPO_CLIENT_ID: string
        PASSWORD_RESET_URL: string
      }
    }
  }
  
export {}