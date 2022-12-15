import { Request } from "express";
import fetch from "node-fetch";
import knex from "../../configs/knex";
import { GoogleResponse, NewUserGoogle } from "../../types/User";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { AuthError } from "../../utils/errors/AuthError";

type UserUpdate = Omit<NewUserGoogle, "username">

/** @Middleware authenticateRequest sets user property */
export const linkGoogleAccount = asyncWrapper(async (req: Request<{},{},{ accessToken: string }>, res) => {
    const { accessToken } = req.body;
    if(!accessToken) throw new AuthError('AUTHENTICATION_FAILED')
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    let response: GoogleResponse;
    try{
        response = await (await fetch(url)).json()
    }catch(err){
        console.error(err)
        throw new AuthError('GOOGLE_AUTH_FAILED')
    }
    const { sub, picture, family_name, given_name } = response;
    const existing = await knex('users').where('google_id', sub).first()
    if(existing) throw new AuthError('GOOGLE_ACCOUNT_IN_USE')
    const user = await knex('users').where('id', req.user).first();
    if(!user) throw new AuthError('AUTHENTICATION_FAILED');
    const update: UserUpdate = { google_id: sub };
    if(!user.avatar) update["avatar"] = picture;
    if(!user.firstname) update['firstname'] = family_name;
    if(!user.lastname) update["lastname"] = given_name;
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
