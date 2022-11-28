import { Request } from "express"
import Joi from "joi"
import knex from "../../configs/knex"
import { AuthCookie } from "../../types/Auth"
import { NewUserObject } from "../../types/User"
import { hashPassword } from "../../utils/auth/passwords"
import { createTokenPairOnAuth } from "../../utils/auth/token"
import { asyncWrapper } from "../../utils/errors/asyncWrapper"
import { AuthError } from "../../utils/errors/AuthError"
import { validateMediaUrl } from "../../utils/validations/validateMediaUrl"

interface RegisterRequest{
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    email: string,
    avatar: { key: string, url: string } | null | undefined
    city: string | null | undefined
    state: string | null | undefined
    bio: string | null | undefined
}

export const registerUser = asyncWrapper(async (req: Request<{},{},RegisterRequest>, res) => {
    const { firstname, lastname, username, password, email, avatar, city, state, bio } = req.body;

    if(!email) throw new AuthError('EMAIL_REQUIRED');
    if(!username) throw new AuthError('USERNAME_REQUIRED');
    if(!password) throw new AuthError('PASSWORD_REQUIRED');

    try{ Joi.assert(email, Joi.string().trim().email()) }
    catch(err){ throw new AuthError('EMAIL_INVALID') }
    try{ Joi.assert(username, Joi.string().trim().min(5).max(50)) }
    catch(err){ throw new AuthError('USERNAME_INVALID') }
    try{ Joi.assert(password, Joi.string().trim().min(7).max(30).pattern(/[a-zA-Z0-9!@#$%^&*.]{7,30}/)) }
    catch(err){ throw new AuthError('PASSWORD_INVALID') }

    const userWithEmail = await knex('users').where('email', email.toLowerCase()).first()
    if(userWithEmail) throw new AuthError('EMAIL_IN_USE')

    const userWithUsername = await knex('users').where('username', username.toLowerCase()).first()
    if(userWithUsername) throw new AuthError('USERNAME_IN_USE')

    const hashbrowns = await hashPassword(password)

    const newUser: NewUserObject = { 
        username: username.toLowerCase(), 
        email: email.toLowerCase(), 
        password: hashbrowns 
    }

    if(firstname) newUser.firstname = firstname;
    if(lastname) newUser.lastname = lastname;
    if(state) newUser.state = state;
    if(city) newUser.city = city;
    if(bio) newUser.bio = bio;

    const [user] = await knex('users').insert(newUser, '*')
        
    let url: string | undefined;

    if(avatar && validateMediaUrl(avatar.url)){
        const [result] = await knex('userAvatars').insert({ ...avatar, user: user.id }, '*')
        await knex('users').where({ id: user.id }).update({ avatar: result.url })
        url = result.url;
    }

    const tokens = await createTokenPairOnAuth({ id: user.id }) 
    res.cookie(AuthCookie.refreshToken, tokens.refreshToken, { httpOnly: true })
    res.status(201).json({ 
        ...tokens,
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username, 
        avatar: url, 
    })

})