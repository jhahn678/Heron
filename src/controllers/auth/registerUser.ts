import { Request } from "express"
import knex from "../../configs/knex"
import { AuthCookie } from "../../types/Auth"
import { NewUserObject } from "../../types/User"
import { AuthError } from "../../utils/errors/AuthError"
import { hashPassword } from "../../utils/auth/passwords"
import { createTokenPairOnAuth } from "../../utils/auth/token"
import { asyncWrapper } from "../../utils/errors/asyncWrapper"
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

    const { email, username, password, firstname, lastname, avatar, city, state, bio } = req.body;

    const userWithUsername = await knex('users').where('username', username).first()
    if(userWithUsername) throw new AuthError('USERNAME_IN_USE')

    const hashbrowns = await hashPassword(password)

    const newUser: NewUserObject = { 
        username: username,
        password: hashbrowns 
    }

    if(email){
        const userWithEmail = await knex('users').where('email', email).first()
        if(userWithEmail) throw new AuthError('EMAIL_IN_USE')
        newUser.email = email;
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