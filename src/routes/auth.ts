import { Router } from 'express'
import controllers from '../controllers';

const router = Router();

router.post('/login', controllers.loginUser)
router.post('/register', controllers.registerUser)


//TO DO
router.get('/email', controllers.checkEmailAvailability)
router.get('/username', controllers.checkUsernameAvailability)
router.post('/forgot-password', controllers.forgotPassword)
router.post('/reset-password', controllers.resetPassword)
router.delete('/delete-account', controllers.deleteAccount)


export default router;