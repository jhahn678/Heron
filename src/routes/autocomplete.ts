import { Router } from 'express'
import controllers from '../controllers'
const router = Router()

router.get('/', controllers.autocompleteAll)
router.get('/geoplaces', controllers.autocompleteGeoplaces)
router.get('/waterbodies', controllers.autocompleteWaterbodies)

export default router;