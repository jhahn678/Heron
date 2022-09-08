import { Request } from 'express'
import { asyncWrapper } from "../utils/errors/asyncWrapper";
import { AuthError } from '../utils/errors/AuthError';
import { UploadError } from '../utils/errors/UploadError';
import { verifyAccessToken } from '../utils/auth/token';
import { validateUploadType } from '../utils/validations/validateUploadType';
import { v4 as uuid } from 'uuid'
import S3Client from '../configs/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const { S3_BUCKET_NAME } = process.env;

//Expiration for signed URL
const UrlTTL = 60 * 5;

interface SignedUrlReq {
    /** Expecting mimetype "image/type" */
    mimetype: string
}

export const getSignedUploadUrl = asyncWrapper(async (req: Request<{},{},{},SignedUrlReq>, res, next) => {
    const { mimetype } = req.query

    if(!mimetype) throw new UploadError('FILE_TYPE_REQUIRED')
    if(!validateUploadType(mimetype)) throw new UploadError('INVALID_FILE_TYPE')
    
    const { authorization } = req.headers;
    if(!authorization) throw new AuthError('AUTHENTICATION_REQUIRED')
    const payload = verifyAccessToken(authorization.split(' ')[1], { error: 'EXPRESS' }) 

    const fileKey = `${payload.id}-${uuid()}.${mimetype.split('/')[1]}`;

    const putCommand = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
        ContentType: mimetype
    })

    getSignedUrl(S3Client, putCommand, { expiresIn: UrlTTL })
        .then(url => res.status(200).json(url))
        .catch(() => res.status(500).json({ error: 'Could not obtain upload url'}))
});

