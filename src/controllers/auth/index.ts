import { addPassword } from "./addPassword";
import { changeEmail } from "./changeEmail";
import { changePassword } from "./changePassword";
import { changeUsername } from "./changeUsername";
import { checkEmailAvailability } from "./checkEmailAvailability";
import { checkUsernameAvailability } from "./checkUsernameAvailability";
import { clearAuthentication } from "./clearAuthentication";
import { deleteAccount } from "./deleteAccount";
import { deleteRefreshToken } from "./deleteRefreshToken";
import { forgotPassword } from "./forgotPassword";
import { getMyAccount } from "./getMyAccount";
import { hasPassword } from "./hasPassword";
import { issueNewAccessToken } from "./issueNewAccessToken";
import { linkAppleAccount } from "./linkAppleAccount";
import { linkFacebookAccount } from "./linkFacebookAccount";
import { linkGoogleAccount } from "./linkGoogleAccount";
import { loginUser } from "./loginUser";
import { loginWithApple } from "./loginWithApple";
import { loginWithFacebook } from "./loginWithFacebook";
import { loginWithGoogle } from "./loginWithGoogle";
import { registerUser } from "./registerUser";
import { resetPassword } from "./resetPassword";
import { unlinkAccount } from "./unlinkAccount";

const authControllers = {
    addPassword,
    changeUsername,
    changeEmail,
    checkEmailAvailability,
    checkUsernameAvailability,
    clearAuthentication,
    deleteAccount,
    forgotPassword,
    getMyAccount,
    hasPassword,
    issueNewAccessToken,
    loginUser,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    linkGoogleAccount,
    linkFacebookAccount,
    linkAppleAccount,
    registerUser,
    resetPassword,
    unlinkAccount,
    deleteRefreshToken,
    changePassword
}

export default authControllers
