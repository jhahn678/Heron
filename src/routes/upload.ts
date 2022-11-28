import { Router } from 'express'
import { requireAccessToken } from '../utils/middleware/auth';
import uploadControllers from '../controllers/upload';

const router = Router();

router.get('/signed-url', requireAccessToken, uploadControllers.getSignedUploadUrl)

export default router