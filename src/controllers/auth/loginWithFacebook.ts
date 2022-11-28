import { Request } from "express";
import fetch from "node-fetch";
import knex from "../../configs/knex";
import { AuthCookie } from "../../types/Auth";
import { FacebookResponse, NewUserFacebook } from "../../types/User";
import { createTokenPairOnAuth } from "../../utils/auth/token";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";
import { v4 as uuid } from 'uuid'

export const loginWithFacebook = asyncWrapper(async (req: Request<{},{},{ accessToken: string }>, res) => {
    const { accessToken } = req.body;
    if(!accessToken) throw new AuthError('ACCESS_TOKEN_REQUIRED')
    const url = `https://graph.facebook.com/me?fields=id,first_name,last_name,picture&access_token=${accessToken}`
    let response: FacebookResponse;
    try{
        response = await (await fetch(url)).json()
    }catch(err){
        console.error(err)
        throw new AuthError('FACEBOOK_AUTH_FAILED')
    }
    const { id: facebook_id, first_name, last_name, picture } = response
    const exists = await knex('users').where('facebook_id', facebook_id).first()
    if(exists){
        const tokens = await createTokenPairOnAuth({ id: exists.id }) 
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({ 
            ...tokens, 
            id: exists.id,
            avatar: exists.avatar, 
            username: exists.username, 
            firstname: exists.firstname,
            lastname: exists.lastname,
            account_created: false
        })
    }else{
        const username = 'u-' + uuid().split('-').join('').slice(0,16).toLowerCase()
        const newUser: NewUserFacebook = { facebook_id, username }
        if(first_name) newUser['firstname'] = first_name;
        if(last_name) newUser['lastname'] = last_name;
        if(picture?.data?.url) newUser['avatar'] = picture.data.url;
        const [result] = await knex('users').insert(newUser, '*')
        const tokens = await createTokenPairOnAuth({ id: result.id })
        res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
        res.status(200).json({
            ...tokens, 
            id: result.id,
            avatar: result.avatar, 
            username: result.username, 
            firstname: result.firstname,
            lastname: result.lastname,
            account_created: true
        })
    }
})