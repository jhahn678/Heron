import { Router } from 'express'
import { authenticateRequest } from '../utils/middleware/auth'
import authControllers from '../controllers/auth';

const router = Router();

router.post('/login', authControllers.loginUser)
router.post('/register', authControllers.registerUser)
router.post('/logout', authControllers.clearAuthentication)
router.get('/email', authControllers.checkEmailAvailability)
router.get('/username', authControllers.checkUsernameAvailability)
router.post('/token', authControllers.issueNewAccessToken)
router.delete('/token', authControllers.deleteRefreshToken)
router.post('/forgot-password', authControllers.forgotPassword)
router.post('/reset-password', authControllers.resetPassword)
router.post('/login/apple', authControllers.loginWithApple)
router.post('/login/facebook', authControllers.loginWithFacebook)
router.post('/login/google', authControllers.loginWithGoogle)
router.post('/change-username', authenticateRequest, authControllers.changeUsername)
router.get('/my-account', authenticateRequest, authControllers.getMyAccount)
router.get('/has-password', authenticateRequest, authControllers.hasPassword)
router.post('/add-password', authenticateRequest, authControllers.addPassword)
router.post('/unlink-account', authenticateRequest, authControllers.unlinkAccount)
router.post("/change-password", authenticateRequest, authControllers.changePassword)
router.delete('/delete-account', authenticateRequest, authControllers.deleteAccount)

export default router;

