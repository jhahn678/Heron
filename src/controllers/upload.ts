import { Request } from 'express'
import { asyncWrapper } from "../utils/errors/asyncWrapper";
import { AuthError } from '../utils/errors/AuthError';
import { UploadError } from '../utils/errors/UploadError';
import { verifyAuthHeader } from '../utils/auth/token';
import { validateUploadFileType } from '../utils/validations/validateUploadFileType';
import knex from '../configs/knex';
import { v4 as uuid } from 'uuid'
import S3Client from '../configs/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
    PutObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'

const { S3_BUCKET_NAME } = process.env;

//Expiration for signed URL
const UrlTTL = 60 * 5;

interface SignedUrlReq {
    filetype: string
}

export const getSignedUploadUrl = asyncWrapper(async (req: Request<{},{},{},SignedUrlReq>, res, next) => {
    const { filetype } = req.query

    if(!filetype) throw new UploadError('FILE_TYPE_REQUIRED')
    if(!validateUploadFileType(filetype)) throw new UploadError('INVALID_FILE_TYPE')

    const user = verifyAuthHeader(req.headers.authorization)
    if(!user) throw new AuthError('AUTHENTICATION_REQUIRED')

    const fileKey = `${user}-${uuid()}`;
    const putCommand = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
        ACL: "public-read",
        ContentType: filetype
    })

    getSignedUrl(S3Client, putCommand, { expiresIn: UrlTTL })
        .then(url => res.status(200).json(url))
        .catch(() => res.status(500).json({ error: 'Could not upload image to AWS'}))

});

