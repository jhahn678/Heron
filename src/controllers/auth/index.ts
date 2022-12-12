import { addPassword } from "./addPassword";
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
    registerUser,
    resetPassword,
    unlinkAccount,
    deleteRefreshToken
}

export default authControllers
