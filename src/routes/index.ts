import { Router } from 'express'
import { errorRequestHandler } from '../controllers/error';
import AuthRouter from './auth'
import UploadRouter from './upload'
import AutocompleteRouter from './autocomplete'
import SupportRouter from './support'
import WaterbodiesRouter from './waterbodies'
const router = Router();

router.use('/auth', AuthRouter)
router.use('/upload', UploadRouter)
router.use('/autocomplete', AutocompleteRouter)
router.use('/support', SupportRouter)
router.use('/waterbodies', WaterbodiesRouter)
router.get('/', (req, res) => res.send('This is the Heron API'))
router.use('*', errorRequestHandler)

export default router;