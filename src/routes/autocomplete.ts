import { Router } from 'express'
import autocompleteControllers from '../controllers/autocomplete'
const router = Router()

router.get('/', autocompleteControllers.autocompleteAll)
router.get('/geoplaces', autocompleteControllers.autocompleteGeoplaces)
router.get('/waterbodies', autocompleteControllers.autocompleteWaterbodies)
router.get('/waterbodies/distinct-name', autocompleteControllers.searchDistinctWaterbodyName)
router.get('/nearest-waterbodies', autocompleteControllers.nearestWaterbodies)
router.get('/nearest-geoplace', autocompleteControllers.nearestGeoplace)
router.get('/users', autocompleteControllers.searchUsersByUsername)

export default router;

