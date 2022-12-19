import knex from "../../configs/knex";
import { Request } from "express";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";

interface ReqQuery {
    username: string
}

export const checkUsernameAvailability = asyncWrapper(async (req: Request<{},{},{},ReqQuery>, res) => {
    const { username } = req.query;
    try{
        const user = await knex('users').where('username', username).first()
        res.status(200).json({ username, available: Boolean(!user) })
    }catch(err){
        res.status(200).json({ username, available: false })
    }
});