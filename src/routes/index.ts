import { Router } from 'express'
import { errorRequestHandler } from '../controllers/error';
import AuthRouter from './auth'

import knex from '../db/knex'

const router = Router();

router.get('/dev', async(req, res) => {
    const users = await knex('users').where({ id: 1 }).update({bio: 'horse'}).returning('*')
    res.status(200).json(users)
})

router.use('/auth', AuthRouter)
router.get('/', (req, res) => res.send('This is the Heron API'))
router.use('*', errorRequestHandler)

export default router;