import { Router } from 'express'
import controllers from '../controllers';
import { authorizeRequest } from '../utils/middleware/auth'

const router = Router();

router.post('/login', controllers.loginUser)
router.post('/register', controllers.registerUser)
router.delete('/delete-account', authorizeRequest, controllers.deleteAccount)
router.get('/email', controllers.checkEmailAvailability)
router.get('/username', controllers.checkUsernameAvailability)

//TO DO
router.post('/forgot-password', controllers.forgotPassword)
router.post('/reset-password', authorizeRequest, controllers.resetPassword)


export default router;