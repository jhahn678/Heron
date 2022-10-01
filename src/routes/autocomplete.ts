import { Router } from 'express'
import controllers from '../controllers'
const router = Router()

router.get('/', controllers.autocompleteAll)
router.get('/geoplaces', controllers.autocompleteGeoplaces)
router.get('/waterbodies', controllers.autocompleteWaterbodies)
router.get('/nearest-waterbodies', controllers.nearestWaterbodies)

export default router;