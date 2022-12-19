import { Router } from 'express'
import autocompleteControllers from '../controllers/autocomplete'
import { validationMiddleware } from '../utils/middleware/validation-errors'
import { query } from 'express-validator'

const router = Router()

router.get(
    '/', [
        query("value").exists().isString().trim(),
        query("lnglat").isString(),
    ],
    validationMiddleware,
    autocompleteControllers.autocompleteAll)

router.get(
    '/geoplaces', [
        query("value").exists().isString().trim(),
        query("lnglat").isString(),
        query("limit").toInt()
    ],
    validationMiddleware,
    autocompleteControllers.autocompleteGeoplaces)

router.get(
    '/waterbodies', [
        query("value").exists().isString().trim(),
        query("lnglat").isString(),
        query("limit").toInt()
    ],
    validationMiddleware,
    autocompleteControllers.autocompleteWaterbodies)

router.get(
    '/waterbodies/distinct-name', [
        query("value").isString().trim(),
        query("classifications").isString(),
        query("admin_one").isString()
    ],
    validationMiddleware,
    autocompleteControllers.searchDistinctWaterbodyName)

router.get(
    '/nearest-waterbodies', 
    query("lnglat").exists().isString(),
    validationMiddleware,
    autocompleteControllers.nearestWaterbodies)

router.get(
    '/nearest-geoplace',
    query("lnglat").exists().isString(),
    validationMiddleware,
    autocompleteControllers.nearestGeoplace)

router.get(
    '/users', [
        query("value").isString(),
        query("user").toInt(),
        query("limit").toInt()
    ],
    validationMiddleware,
    autocompleteControllers.searchUsersByUsername)


export default router;

