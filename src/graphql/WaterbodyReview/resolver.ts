import knex from "../../configs/knex";
import { Resolvers } from "../../types/graphql";
import { addWaterbodyReview } from "./mutations/addWaterbodyReview";
import { deleteWaterbodyReview } from "./mutations/deleteWaterbodyReview";
import { editWaterbodyReview } from "./mutations/editWaterbodyReview";
import { getWaterbodyReview } from "./queries/getWaterbodyReview";
import { getWaterbodyReviews } from "./queries/getWaterbodyReviews";

export const resolver: Resolvers = {
    Query: {
        waterbodyReview: getWaterbodyReview,
        waterbodyReviews: getWaterbodyReviews
    },
    Mutation: {
        addWaterbodyReview,
        deleteWaterbodyReview,
        editWaterbodyReview
    },
    WaterbodyReview: {
        //can be optimized by default joining waterbody
        waterbody: async ({ waterbody }) => {
            return (await knex('waterbodies').where({ id: waterbody }).first())
        },
        // //can be optimized by default joining user
        user: async ({ user }) => {
            return (await knex('users').where({ id: user }).first())
        }
    }
}