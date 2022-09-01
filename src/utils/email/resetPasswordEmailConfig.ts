import { 
    SendEmailCommand,
    SendEmailCommandInput, 
    SendEmailCommandOutput 
}  from "@aws-sdk/client-ses";
import sesClient from "../../configs/ses";
import { AuthError } from "../errors/AuthError";

interface Params {
    emailAddress: string,
    resetPasswordToken: string
}

const RESET_URL = 'http://localhost:4000/auth/reset-password?token='
const SENDER_ADDRESS = 'jhahn6789@gmail.com'

const createResetPasswordCommandInput = (params: Params): SendEmailCommand => new SendEmailCommand({
    Destination: {
        ToAddresses: [params.emailAddress],
    },
    Message: {
        Body: {
            Html: {
                Charset: "UTF-8",
                Data: `<p>A request was received to reset your password. If this was you, follow this link to proceed: ${RESET_URL}${params.resetPasswordToken}</p>`,
            },
        },
        Subject: {
            Charset: "UTF-8",
            Data: "Heron -- Password Reset Request",
        },
    },
    Source: SENDER_ADDRESS
})

export const sendPasswordResetEmail = async (params: Params): Promise<SendEmailCommandOutput> => {
    try {
        const emailCommand = createResetPasswordCommandInput(params)
        const data = await sesClient.send(emailCommand);
        return data
      } catch (err) {
        console.error(err)
        throw new AuthError('PASSWORD_RESET_EMAIL_FAILED')
      }
}
