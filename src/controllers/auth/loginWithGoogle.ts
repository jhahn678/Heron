import { Request } from "express";
import fetch from "node-fetch";
import knex from "../../configs/knex";
import { AuthCookie } from "../../types/Auth";
import { GoogleResponse, NewUserGoogle } from "../../types/User";
import { createTokenPairOnAuth } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";
import { v4 as uuid } from 'uuid'

export const loginWithGoogle = asyncWrapper(async (req: Request<{},{},{ accessToken: string }>, res) => {
    const { accessToken } = req.body;
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    let response: GoogleResponse;
    try{
        response = await (await fetch(url)).json()
    }catch(err){
        console.error(err)
        throw new AuthError('GOOGLE_AUTH_FAILED')
    }
    const { 
        sub: google_id, 
        picture: avatar,
        family_name: lastname, 
        given_name: firstname, 
    } = response;
    const user = await knex('users').where('google_id', google_id).first()
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
        const userObj: NewUserGoogle = { username, google_id };
        if(avatar) userObj['avatar'] = avatar;
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
