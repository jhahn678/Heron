import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { asyncWrapper } from '../../utils/errors/asyncWrapper';
import { validateUploadType } from '../../utils/validations/validateUploadType';
import { UploadError } from '../../utils/errors/UploadError';
import S3Client from '../../configs/s3';
const { S3_BUCKET_NAME } = process.env;

//Expiration for signed URL
const UrlTTL = 60; //seconds

interface SignedUrlReq {
    /** Expecting mimetype "image/type" */
    mimetype: string
}

export const getSignedUploadUrl = asyncWrapper(async (req: Request<{},{},{},SignedUrlReq>, res) => {
    
    const { mimetype } = req.query

    if(!validateUploadType(mimetype)) throw new UploadError('INVALID_FILE_TYPE')

    const fileKey = `${req.user}-${uuid()}.${mimetype.split('/')[1]}`;

    const putCommand = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
        ContentType: mimetype
    })

    getSignedUrl(S3Client, putCommand, { expiresIn: UrlTTL })
        .then(url => res.status(200).json(url))
        .catch(() => res.status(500).json({ error: 'Could not obtain upload url'}))
});