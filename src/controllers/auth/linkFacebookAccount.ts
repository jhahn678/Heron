import { Request } from "express";
import fetch from "node-fetch";
import knex from "../../configs/knex";
import { FacebookResponse, NewUserFacebook } from "../../types/User";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

type UserUpdate = Omit<NewUserFacebook, "username">

/** @Middleware authenticateRequest sets user property */
export const linkFacebookAccount = asyncWrapper(async (req: Request<{},{},{ accessToken: string }>, res) => {
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
    if(exists) throw new AuthError('FACEBOOK_ACCOUNT_IN_USE')
    const user = await knex("users").where('id', req.user).first()
    if(!user) throw new AuthError("AUTHENTICATION_FAILED")
    const update: UserUpdate = { facebook_id };
    if(!user.firstname) update['firstname'] = first_name;
    if(!user.lastname) update["lastname"] = last_name;
    if(!user.avatar && picture?.data?.url) update["avatar"] = picture.data.url;
    const [updated] = await knex('users').where('id', req.user).update(update, '*')
    const { id, username, firstname, lastname, avatar } = updated;
    res.status(200).json({
        id,
        username,
        firstname,
        lastname,
        avatar,
        account_created: false
    })
})