import { Router } from 'express'
import { errorRequestHandler } from '../controllers/error';
import AuthRouter from './auth'

const router = Router();

router.use('/auth', AuthRouter)
router.get('/', (req, res) => res.send('This is the Heron API'))
router.use('*', errorRequestHandler)

export default router;