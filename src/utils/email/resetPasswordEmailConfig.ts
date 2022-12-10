import { 
    SendEmailCommand, 
    SendEmailCommandOutput 
}  from "@aws-sdk/client-ses";
import sesClient from "../../configs/ses";
import { AuthError } from "../errors/AuthError";
const { PASSWORD_RESET_URL } = process.env;

interface Params {
    emailAddress: string,
    resetPasswordToken: string
}

const SENDER_ADDRESS = 'support@heron-mobile.com'

const createResetPasswordCommandInput = (params: Params): SendEmailCommand => new SendEmailCommand({
    Destination: {
        ToAddresses: [params.emailAddress],
    },
    Message: {
        Body: {
            Html: {
                Charset: "UTF-8",
                Data: `
                <p>A request was received to reset your password. If this was you, follow this link to proceed:</p>
                <a href="${PASSWORD_RESET_URL}${params.resetPasswordToken}">${PASSWORD_RESET_URL}/${params.resetPasswordToken}</a> 
                `,
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
