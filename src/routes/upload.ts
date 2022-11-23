import { Router } from 'express'
import controllers from '../controllers';
import { requireAccessToken } from '../utils/middleware/auth';

const router = Router();

router.get('/signed-url', requireAccessToken, controllers.getSignedUploadUrl)

export default router