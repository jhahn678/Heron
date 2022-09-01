import  { SESClient }  from  "@aws-sdk/client-ses";
const { AWS_REGION } = process.env;

const sesClient = new SESClient({ 
    region: AWS_REGION,
    credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY!,
        secretAccessKey: process.env.SES_SECRET_KEY!
    }
});

export default sesClient;