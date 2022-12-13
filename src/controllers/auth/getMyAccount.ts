import knex from "../../configs/knex";
import { asyncWrapper } from "../../utils/errors/asyncWrapper";
import { RequestError } from "../../utils/errors/RequestError";

/** @Middleware authenticateRequest sets user property */
export const getMyAccount = asyncWrapper(async (req, res) => {
    const result = await knex('users')
        .where('id', req.user)
        .first('email', 'apple_id', 'facebook_id', 'google_id')
    if(!result) throw new RequestError('REQUEST_FAILED')
    res.status(200).json(result)
})