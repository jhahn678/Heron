import { Request } from "express";
import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";

interface UserSearchQuery {
    value: string | undefined | null
    user?: number
    limit?: number
}

export const searchUsersByUsername = asyncWrapper(async(req: Request<{},{},{},UserSearchQuery>, res) => {
    const { value, user, limit } = req.query;
    
    if(!value) {
        res.status(200).json([])
    }else{
        const query = knex('users')
            .select('firstname', 'lastname', 'id', 'avatar', 'username', 'city', 'state')
            .whereILike('username', value + '%')
            .limit(limit || 10)
        if(user) {
            query.with(
                'follows', 
                knex.raw(`
                    select "following" 
                    from user_followers 
                    where "user" = ?
                `, [user])
            )
            query.select(knex.raw(`(
                select exists (select * from follows where "following" = users.id)
            ) as am_following`))
            query.whereNot('id', user)
        }else{
            query.select(knex.raw('false as am_following'))
        }
        const results = await query;
        res.status(200).json(results)
    }
})