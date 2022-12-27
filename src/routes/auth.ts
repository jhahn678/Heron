import { Router } from 'express'
import authControllers from '../controllers/auth';
import { body, query } from 'express-validator'
import { authenticationMiddleware } from '../utils/middleware/auth'
import { validationMiddleware } from '../utils/middleware/validation-errors';

const router = Router();

router.post(
    '/login', [
        body('password').exists().isString().trim(),
        body('identifier').exists().isString().trim().toLowerCase()
    ],
    validationMiddleware,
    authControllers.loginUser)

router.post(
    '/register', [
        body('username').trim().isString().toLowerCase().isLength({ min: 6, max: 36 }).exists(),
        body("password").isString().matches(/[a-zA-Z0-9!@#$%^&*.]{7,30}/).exists(),
        body("email").isEmail().trim().toLowerCase().optional(),
        body('firstname').isString().trim().optional(),
        body('lastname').isString().trim().optional(),
        body("avatar").isObject().optional(),
        body("city").isString().optional(),
        body("state").isString().optional(),
        body("bio").isString().optional()
    ],
    validationMiddleware,
    authControllers.registerUser)

router.post(
    '/token', [
        body('token').isString().exists(),
        body('includeUser').toBoolean().optional()
    ],
    validationMiddleware,
    authControllers.issueNewAccessToken)

router.delete(
    '/token',
    body('refreshToken').isString().exists(),
    validationMiddleware,
    authControllers.deleteRefreshToken)

router.post(
    '/logout', 
    authControllers.clearAuthentication)

router.get(
    '/email', 
    query('email').trim().isEmail().toLowerCase().exists(),
    validationMiddleware,
    authControllers.checkEmailAvailability)

router.post(
    '/reset-password', [
        body("token").exists().isString(),
        body("password").exists().isString().matches(/[a-zA-Z0-9!@#$%^&*.]{7,30}/),
    ], 
    validationMiddleware,
    authControllers.resetPassword)

router.post(
    '/forgot-password', 
    body("email").exists().trim().isEmail().toLowerCase(),
    validationMiddleware,
    authControllers.forgotPassword)

router.get(
    '/username',
    query('username').exists().isString().trim().isLength({ min: 6, max: 36 }).toLowerCase(),
    validationMiddleware,
    authControllers.checkUsernameAvailability)

router.post(
    '/login/apple', [
        body('apple_id').exists().isString(),
        body('firstname').isString().optional(),
        body('lastname').isString().optional()
    ],
    validationMiddleware,
    authControllers.loginWithApple)

router.post(
    '/login/google', 
    body("accessToken").exists().isString(),
    validationMiddleware,
    authControllers.loginWithGoogle)

router.post(
    '/login/facebook',
    body("accessToken").exists().isString(), 
    validationMiddleware,
    authControllers.loginWithFacebook)

router.post(
    "/link/google",
    body("accessToken").exists().isString(),
    validationMiddleware,
    authenticationMiddleware, 
    authControllers.linkGoogleAccount)

router.post(
    "/link/facebook",
    body("accessToken").exists().isString(),
    validationMiddleware,
    authenticationMiddleware, 
    authControllers.linkFacebookAccount)

router.post(
    "/link/apple",
    body("apple_id").exists().isString(),
    validationMiddleware, 
    authenticationMiddleware, 
    authControllers.linkAppleAccount)

router.get(
    '/my-account', 
    authenticationMiddleware, 
    authControllers.getMyAccount)

router.get(
    '/has-password', 
    authenticationMiddleware, 
    authControllers.hasPassword)


router.post(
    '/add-password',
    body("password").exists().isString().matches(/[a-zA-Z0-9!@#$%^&*.]{7,30}/),
    validationMiddleware,
    authenticationMiddleware, 
    authControllers.addPassword)

router.post(
    '/change-email', 
    body("email").exists().isEmail(),
    validationMiddleware,
    authenticationMiddleware, 
    authControllers.changeEmail)

router.post(
    '/unlink-account', 
    body("account").exists().isIn(["apple", "google", "facebook"]),
    validationMiddleware,
    authenticationMiddleware, 
    authControllers.unlinkAccount)

router.post(
    '/change-username', 
    body("username").exists().isString().toLowerCase(),
    validationMiddleware,
    authenticationMiddleware, 
    authControllers.changeUsername)
    
router.post(
    "/change-password", 
    body("password").exists().isString(),
    validationMiddleware,
    authenticationMiddleware, 
    authControllers.changePassword)
    
router.delete(
    '/delete-account', 
    authenticationMiddleware, 
    authControllers.deleteAccount)


export default router;

