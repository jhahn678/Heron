import { Router } from 'express'
import { requireAccessToken } from '../utils/middleware/auth'
import authControllers from '../controllers/auth';

const router = Router();

router.post('/login', authControllers.loginUser)
router.post('/register', authControllers.registerUser)
router.post('/logout', authControllers.clearAuthentication)
router.delete('/delete-account', requireAccessToken, authControllers.deleteAccount)
router.get('/email', authControllers.checkEmailAvailability)
router.get('/username', authControllers.checkUsernameAvailability)
router.post('/token', authControllers.issueNewAccessToken)
router.post('/forgot-password', authControllers.forgotPassword)
router.post('/reset-password', authControllers.resetPassword)
router.get('/my-account', authControllers.getMyAccount)
router.post('/login/apple', authControllers.loginWithApple)
router.post('/login/facebook', authControllers.loginWithFacebook)
router.post('/login/google', authControllers.loginWithGoogle)
router.post('/change-username', authControllers.changeUsername)
router.get('/has-password', authControllers.hasPassword)
router.post('/add-password', authControllers.addPassword)
router.post('/unlink-account', authControllers.unlinkAccount)

export default router;

