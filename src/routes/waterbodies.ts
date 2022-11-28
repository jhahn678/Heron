import { Router } from 'express'
import waterbodyControllers from '../controllers/waterbodies'

const router = Router()

router.get('/', waterbodyControllers.getWaterbodies)
router.get('/name', waterbodyControllers.getWaterbodiesByName)

export default router;