import { Router } from 'express'
import uploadControllers from '../controllers/upload';
import { authenticationMiddleware } from '../utils/middleware/auth';
import { query } from 'express-validator'

const router = Router();

router.get('/signed-url',
    query("mimetype").exists().isString(),
    authenticationMiddleware, 
    uploadControllers.getSignedUploadUrl)

export default router