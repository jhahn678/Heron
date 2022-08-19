import { Router } from 'express'
import { errorRequestHandler } from '../controllers/error';
import AuthRouter from './auth'
import UploadRouter from './upload'
const router = Router();





import { polygon } from '@turf/helpers'
import knex from '../configs/knex'
router.get('/dev', async(req, res) => {
    // const users = await knex('users').where({ id: 1 }).update({bio: 'horse'}).returning('*')
    const geom = polygon([[ [12, 21], [13, 24], [14, 25], [15, 26], [12, 21]]])
    console.log(geom.geometry)
    console.log(`${JSON.stringify(geom.geometry)}`)
    res.status(200).json(geom.geometry)
})







router.use('/auth', AuthRouter)
router.use('/upload', UploadRouter)
router.get('/', (req, res) => res.send('This is the Heron API'))
router.use('*', errorRequestHandler)

export default router;