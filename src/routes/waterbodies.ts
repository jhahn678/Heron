import { Router } from 'express'
import controllers from '../controllers'
const router = Router()

router.get('/name', controllers.getWaterbodiesByName)

export default router;