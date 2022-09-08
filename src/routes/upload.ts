import { Router } from 'express'
import controllers from '../controllers';
const router = Router();

router.get('/signed-url', controllers.getSignedUploadUrl)

export default router