import { Router } from 'express'
import { authenticateRequest } from '../utils/middleware/auth';
import uploadControllers from '../controllers/upload';

const router = Router();

router.get('/signed-url', authenticateRequest, uploadControllers.getSignedUploadUrl)

export default router