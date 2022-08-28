import { Router } from 'express'
import { errorRequestHandler } from '../controllers/error';
import AuthRouter from './auth'
import UploadRouter from './upload'
const router = Router();

router.use('/auth', AuthRouter)
router.use('/upload', UploadRouter)
router.get('/', (req, res) => res.send('This is the Heron API'))
router.use('*', errorRequestHandler)

export default router;