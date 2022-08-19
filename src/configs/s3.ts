import { S3Client as client } from '@aws-sdk/client-s3'
const { S3_ACCESS_KEY, S3_SECRET_KEY, AWS_REGION } = process.env;


const S3Client = new client({
    region: AWS_REGION!,
    credentials: {
        accessKeyId: S3_ACCESS_KEY!,
        secretAccessKey: S3_SECRET_KEY!
    }
})


export default S3Client;