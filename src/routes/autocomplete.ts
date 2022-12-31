import { Router } from 'express'
import autocompleteControllers from '../controllers/autocomplete'
import { validationMiddleware } from '../utils/middleware/validation-errors'
import { query } from 'express-validator'

const router = Router()

router.get(
    '/', [
        query("value").exists().isString().trim(),
        query("lnglat").isString().optional(),
    ],
    validationMiddleware,
    autocompleteControllers.autocompleteAll)

router.get(
    '/geoplaces', [
        query("value").exists().isString().trim(),
        query("lnglat").isString().optional(),
        query("limit").toInt().optional(),
        query("fclass").isString().optional()
    ],
    validationMiddleware,
    autocompleteControllers.autocompleteGeoplaces)

router.get(
    '/waterbodies', [
        query("value").exists().isString().trim(),
        query("lnglat").isString().optional(),
        query("limit").toInt().optional(),
    ],
    validationMiddleware,
    autocompleteControllers.autocompleteWaterbodies)

router.get(
    '/waterbodies/distinct-name', [
        query("value").isString().trim().optional(),
        query("classifications").isString().optional(),
        query("admin_one").isString().optional()
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
        query("value").isString().optional(),
        query("user").toInt().optional(),
        query("limit").toInt().optional()
    ],
    validationMiddleware,
    autocompleteControllers.searchUsersByUsername)


export default router;

