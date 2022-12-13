import { Request } from "express";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { validateUsername } from "../../utils/validations/validateUsername";

interface ReqQuery {
    username: string
}

export const checkUsernameAvailability = asyncWrapper(async (req: Request<{},{},{},ReqQuery>, res) => {
    const { username } = req.query;
    try{
        validateUsername(username)
        const user = await knex('users').where('username', username.toLowerCase()).first()
        res.status(200).json({ username, available: Boolean(!user) })
    }catch(err){
        res.status(200).json({ username, available: false })
    }
});