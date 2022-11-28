import { Request } from "express";
import knex from "../../configs/knex";
import { AuthCookie } from "../../types/Auth";
import { createTokenPairOnAuth } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";
import { v4 as uuid } from 'uuid'

interface AppleLoginBody {
    apple_id: string
    firstname?: string
    lastname?: string
}

export const loginWithApple  = asyncWrapper(async (req: Request<{},{},AppleLoginBody>, res) => {
    const { apple_id, firstname, lastname } = req.body;
    if(!apple_id) throw new AuthError('AUTHENTICATION_FAILED')
    const user =  await knex('users').where({ apple_id }).first()
    if(user){
        const tokens = await createTokenPairOnAuth({ id: user.id }) 
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({ 
            ...tokens, 
            id: user.id,
            avatar: user.avatar, 
            username: user.username, 
            firstname: user.firstname,
            lastname: user.lastname,
            account_created: false
        })
    }else{
        const username = 'u-' + uuid().split('-').join('').slice(0,16).toLowerCase()
        const userObj: AppleLoginBody & { username: string } = { apple_id, username };
        if(firstname) userObj['firstname'] = firstname;
        if(lastname) userObj['lastname'] = lastname;
        const [newUser] = await knex('users').insert(userObj, '*')
        const tokens = await createTokenPairOnAuth({ id: newUser.id })
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({
            ...tokens,
            id: newUser.id,
            avatar: newUser.avatar,
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            account_created: true
        })
    }
})