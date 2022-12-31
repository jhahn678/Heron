import { Request } from "express";
import knex from "../../configs/knex";
import { AuthCookie } from "../../types/Auth";
import { createTokenPairOnAuth } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { v4 as uuid } from 'uuid'

interface AppleLoginBody {
    apple_id: string
    firstname?: string
    lastname?: string
}

export const loginWithApple  = asyncWrapper(async (req: Request<{},{},AppleLoginBody>, res) => {
    const { apple_id, firstname, lastname } = req.body;
    const user =  await knex('users').where({ apple_id }).first()
    if(user){
        const tokens = await createTokenPairOnAuth({ id: user.id }) 
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({ 
            ...tokens, 
            id: user.id,
            bio: user.bio,
            city: user.city,
            state: user.state,
            avatar: user.avatar, 
            lastname: user.lastname,
            username: user.username, 
            firstname: user.firstname,
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
            bio: newUser.bio,
            city: newUser.city,
            state: newUser.state,
            avatar: newUser.avatar, 
            lastname: newUser.lastname,
            username: newUser.username, 
            firstname: newUser.firstname,
            account_created: true
        })
    }
})