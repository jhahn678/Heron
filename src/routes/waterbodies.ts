import { Router } from 'express'
import waterbodyControllers from '../controllers/waterbodies'
import { query } from 'express-validator'
import { validationMiddleware } from '../utils/middleware/validation-errors'

const router = Router()

router.get(
    '/', [
        query("value").isString().optional(),
        query("classifications").isString().toLowerCase().optional(),
        query("admin_one").isString().optional(),
        query("states").isString().optional(),
        query("minWeight").isFloat().optional(),
        query("maxWeight").isFloat().optional(),
        query("ccode").isString().optional(),
        query("country").isString().optional(),
        query("subregion").isString().optional(),
        query("geometries").toBoolean().optional(),
        query("lnglat").isString().optional(),
        query("within").toFloat().optional(),
        query("sort").isIn(['distance', 'rank']).optional(),
        query("page").toInt().optional(),
        query("limit").toInt().optional(),
    ],
    validationMiddleware,
    waterbodyControllers.getWaterbodies)


router.get(
    '/name', [
        query("name").exists().isString(),
        query("classification").isString().toLowerCase().optional(),
        query("admin_one").isString().optional()
    ],
    validationMiddleware,
    waterbodyControllers.getWaterbodiesByName)

export default router;