import { Router } from 'express'
import waterbodyControllers from '../controllers/waterbodies'
import { query } from 'express-validator'
import { validationMiddleware } from '../utils/middleware/validation-errors'

const router = Router()

router.get(
    '/', [
        query("value").isString(),
        query("classifications").isString().toLowerCase(),
        query("admin_one").isString(),
        query("states").isString(),
        query("minWeight").isFloat(),
        query("maxWeight").isFloat(),
        query("ccode").isString(),
        query("country").isString(),
        query("subregion").isString(),
        query("geometries").toBoolean(),
        query("lnglat").isString(),
        query("within").toFloat(),
        query("sort").isIn(['distance', 'rank']),
        query("page").toInt(),
        query("limit").toInt(),
    ],
    validationMiddleware,
    waterbodyControllers.getWaterbodies)


router.get(
    '/name', [
        query("name").exists().isString(),
        query("classification").isString().toLowerCase(),
        query("admin_one").isString()
    ],
    validationMiddleware,
    waterbodyControllers.getWaterbodiesByName)

export default router;