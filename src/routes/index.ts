import { Router } from 'express'
import { errorRequestHandler } from '../controllers/error';
import AuthRouter from './auth'
import UploadRouter from './upload'
const router = Router();


import redis from '../configs/redis'
import * as crypto from 'crypto'
import { asyncWrapper } from '../utils/errors/asyncWrapper';
router.get('/dev', asyncWrapper(async (req, res) => {
    const result = await redis.del("qRtFs-4jRmrM5bgfjurclS2lkDk_29e93knqXIjkQkA")
    res.status(200).json(result)
}))


router.use('/auth', AuthRouter)
router.use('/upload', UploadRouter)
router.get('/', (req, res) => res.send('This is the Heron API'))
router.use('*', errorRequestHandler)

export default router;