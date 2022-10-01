const { S3_BASE_URL } = process.env;

export const validateMediaUrl = (url: string | undefined | null): Boolean => {
    if(typeof url !== 'string') return false;
    return url.startsWith(S3_BASE_URL!)
}