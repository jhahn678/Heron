const { S3_BASE_URL } = process.env;


export const validateMediaUrl = (url: string): Boolean => {
    return url.startsWith(S3_BASE_URL!)
}