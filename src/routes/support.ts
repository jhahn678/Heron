import { Router } from 'express'
import controllers from '../controllers'
const router = Router()

router.post('/report-problem', controllers.reportProblem)

export default router;
