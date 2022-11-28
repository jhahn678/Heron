import { Router } from 'express'
import supportControllers from '../controllers/support';

const router = Router()

router.post('/report-problem', supportControllers.reportProblem)

export default router;
