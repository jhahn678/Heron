import { Request } from "express";
import * as crypto from 'crypto'
import knex from "../../configs/knex";
import { sendPasswordResetEmail } from "../../utils/email/resetPasswordEmailConfig";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

export const forgotPassword = asyncWrapper(async (req: Request<{},{},{ email: string }>, res) => {
    const { email } = req.body;
    if(!email) throw new AuthError('EMAIL_REQUIRED')
    const user = await knex('users').where({ email: email.toLowerCase() }).first()
    if(user) {
        const token = crypto.randomBytes(32).toString('base64url')
        await knex('passwordResetTokens')
            .insert({ user: user.id, token })
            .onConflict('user')
            .merge(['token', 'created_at'])
        await sendPasswordResetEmail({ emailAddress: email, resetPasswordToken: token })
    }
    res.status(200).json({ message: 'Request received' })
})
