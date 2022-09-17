import { Router } from 'express'
import { errorRequestHandler } from '../controllers/error';
import AuthRouter from './auth'
import UploadRouter from './upload'
import AutocompleteRouter from './autocomplete'
const router = Router();

import { asyncWrapper } from '../utils/errors/asyncWrapper';
import knex from '../configs/knex'
router.get('/dev', asyncWrapper(async (req, res) => {

    const result = await knex("locations")
        .select(
             "*",
            knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom")
        ).where('waterbody', 162607)


    res.status(200).json(result)
}))


router.use('/auth', AuthRouter)
router.use('/upload', UploadRouter)
router.use('/autocomplete', AutocompleteRouter)
router.get('/', (req, res) => res.send('This is the Heron API'))
router.use('*', errorRequestHandler)

export default router;