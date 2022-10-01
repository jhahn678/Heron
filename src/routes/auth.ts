import { Router } from 'express'
import controllers from '../controllers';
import { authorizeRequest } from '../utils/middleware/auth'

const router = Router();

router.post('/login', controllers.loginUser)
router.post('/register', controllers.registerUser)
router.delete('/delete-account', authorizeRequest, controllers.deleteAccount)
router.get('/email', controllers.checkEmailAvailability)
router.get('/username', controllers.checkUsernameAvailability)
router.post('/token', controllers.issueNewAccessToken)
router.post('/forgot-password', controllers.forgotPassword)
router.post('/reset-password', controllers.resetPassword)
router.get('/my-account', controllers.getMyAccount)

export default router;

