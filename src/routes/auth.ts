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
        body('username')
            .exists().isString().trim()
            .isLength({ min: 6, max: 36 })
            .toLowerCase(),
        body("password").exists().isString().matches(/[a-zA-Z0-9!@#$%^&*.]{7,30}/),
        body("email").trim().isEmail().toLowerCase(),
        body('firstname').isString().trim(),
        body('lastname').isString().trim(),
        body("avatar").isObject(),
        body("city").isString(),
        body("state").isString(),
        body("bio").isString()
    ],
    validationMiddleware,
    authControllers.registerUser)

router.post(
    '/token', [
        body('token').exists().isString(),
        body('includeUser').toBoolean()
    ],
    validationMiddleware,
    authControllers.issueNewAccessToken)

router.delete(
    '/token',
    body('refreshToken').exists().isString(),
    validationMiddleware,
    authControllers.deleteRefreshToken)

router.post(
    '/logout', 
    authControllers.clearAuthentication)

router.get(
    '/email', 
    query('email').exists().trim().isEmail().toLowerCase(),
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
    query('username')
        .exists().isString().trim()
        .isLength({ min: 6, max: 36 })
        .toLowerCase(),
    validationMiddleware,
    authControllers.checkUsernameAvailability)

router.post(
    '/login/apple', [
        body('apple_id').exists().isString(),
        body('firstname').isString(),
        body('lastname').isString()
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

