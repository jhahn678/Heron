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
router.post('/login/apple', controllers.loginWithApple)
router.post('/login/facebook', controllers.loginWithFacebook)
router.post('/login/google', controllers.loginWithGoogle)
router.post('/change-username', controllers.changeUsername)
router.get('/has-password', controllers.hasPassword)
router.post('/add-password', controllers.addPassword)
router.post('/unlink-account', controllers.unlinkAccount)


export default router;

