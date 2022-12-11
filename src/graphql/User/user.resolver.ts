import knex from "../../configs/knex";
import { Privacy, Resolvers, ReviewSort } from "../../types/graphql";
import { CatchStatisticsRes, LocationStatisticsRes } from "../../types/User";
import { deleteUser } from "./mutations/deleteUser";
import { followUser } from "./mutations/followUser";
import { unfollowUser } from "./mutations/unfollowUser";
import { updateUserAvatar } from "./mutations/updateUserAvatar";
import { updateUserDetails } from "./mutations/updateUserDetails";
import { getActivityFeed } from "./queries/getActivityFeed";
import { getMe } from "./queries/getMe";
import { getUser } from "./queries/getUser";

export const resolver: Resolvers = {
    Query: {
        me: getMe,
        user: getUser,
        activityFeed: getActivityFeed
    },
    Mutation: {
        followUser,
        deleteUser,
        unfollowUser,
        updateUserAvatar,
        updateUserDetails
    },
    User: {
        fullname: ({ firstname, lastname }) => {
            if(firstname && lastname) return `${firstname} ${lastname}`
            if(firstname) return firstname;
            if(lastname) return lastname;
            return null;
        },
        location: ({ city, state }) => {    
            if(city && state) return `${city}, ${state}`;
            if(city) return city;
            if(state) return state;
            return null
        },
        locations: async ({ id }, { date, waterbody, privacy, limit, offset }, { auth }) => {
            const query = knex('locations')
                .select('*', 
                    knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
                    knex.raw(`(select count(*) from location_favorites where "location" = locations.id) as total_favorites`)
                )
                .where('user', id)
                .orderBy('created_at', 'desc')
            if(auth === id && privacy) query.whereIn('privacy', privacy)
            if(auth !== id){
                query.where('privacy', Privacy.Public)
                query.orWhereRaw(`
                    privacy = 'FRIENDS' 
                    and "user" in (
                        select "following" 
                        from user_followers
                        where "user" = ?
                    )
                `,[auth])
            }
            if(date?.min) query.where('created_at', '>=', date.min)
            if(date?.max) query.where('created_at', '<=', date.max)
            if(waterbody) query.whereIn('waterbody', waterbody)
            query.limit(limit || 20)
            query.offset(offset || 0)
            return (await query);
        },
        catches: async ({ id }, { date, waterbody, species, length, weight, limit, offset }) => {
            const query = knex('catches')
                .select('*', knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"))
                .where('user', id)
                .orderBy('created_at', 'desc')
            if(date?.min) query.where('created_at', '>=', date.min)
            if(date?.max) query.where('created_at', '<=', date.max)
            if(waterbody) query.whereIn('waterbody', waterbody)
            if(species) query.whereIn('species', species)
            if(length?.min) query.where('length', '>=', length.min)
            if(length?.max) query.where('length', '<=', length.max)
            if(weight?.min) query.where('weight', '>=', weight.min)
            if(weight?.max) query.where('weight', '<=', weight.max)
            query.limit(limit || 20)
            query.offset(offset || 0)
            return (await query);
        },
        am_following: async ({ id }, _, { auth }, { path }) => {
            if(path.prev?.prev?.key === 'following') return true;
            if(!auth) return false;
            const result = await knex.raw(`
                select exists(
                    select * from user_followers 
                    where "user" = ?
                    and "following" = ?
                )
            `,[auth, id])
            return result.rows[0].exists as boolean
        },
        follows_me: async ({ id }, _, { auth }, { path }) => {
            if(path.prev?.prev?.key === 'followers') return true;
            if(!auth) return false;
            const result = await knex.raw(`
                select exists(
                    select * from user_followers
                    where "user" = ?
                    and "following" = ?
                )
            `,[id, auth])
            return result.rows[0].exists as boolean
        },
        following: async ({ id }, { offset, limit }) => {
            const result = await knex('users')
                .whereIn("id", function(){
                    this.from('userFollowers')
                    .select('following')
                    .where('user', id)
                    .offset(offset || 0)
                    .limit(limit || 20)
                })
            return result;
        },
        total_following: async ({ id }) => {
            const [{ count }] = await knex('userFollowers').where('user', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count);
        },
        followers: async ({ id }, { offset, limit }) => {
            const result = await knex('users')
                .whereIn("id", function(){
                    this.from('userFollowers')
                    .select('user')
                    .where('following', id)
                    .offset(offset || 0)
                    .limit(limit || 20)
                })
            return result;
        },
        total_followers: async ({ id }) => {
            const [{ count }] = await knex('userFollowers').where('following', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count);
        },
        total_locations: async ({ id }) => {
            const [{ count }] = await knex('locations').where('user', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count);
        },
        saved_locations: async ({ id }, { limit, offset }) => {
            const results = await knex('locations')
                .select("*",
                    knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"),
                    knex.raw(`( select count(*) 
                        from location_favorites 
                        where location = ?
                    ) as total_favorites`, [id])
                )
                .whereIn("id", function(){
                    this.from('savedLocations')
                        .select('location')
                        .where({ user: id })
                        .orderBy('created_at', 'desc')
                        .offset(offset || 0)
                        .limit(limit || 20)
                })
            return results;
        },
        total_saved_locations: async ({ id }) => {
            const [{ count }] = await knex('savedLocations').where('user', id).count()
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        total_catches: async ({ id }) => {
            const [{ count }] = await knex('catches').where('user', id).count()
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        saved_waterbodies: async ({ id }, { offset, limit }) => {
            const results = await knex('waterbodies')
                .whereIn("id", function(){
                    this.from('savedWaterbodies')
                        .select('waterbody')
                        .where({ user: id })
                        .orderBy('created_at', 'desc')
                        .offset(offset || 0)
                        .limit(limit || 20)
                })
            return results;
        },
        total_saved_waterbodies: async ({ id }) => {
            const [{ count }] = await knex('savedWaterbodies').where('user', id).count()
            if(typeof count === 'number') return count;
            return parseInt(count)
        },
        catch_statistics: async ({ id }) => {
            const { rows } = await knex.raw(`
                select species_counts, waterbody_counts, total_catches, largest_catch from (
                    select json_agg(spec) as species_counts,
                    (
                        select "id" from catches
                        where "user" = ?
                        and "length" IS NOT NULL
                        order by "length" desc
                        limit 1
                    ) as largest_catch,
                    (
                        select count(*) 
                        from catches 
                        where "user" = ?
                    )::int as total_catches,
                    1 as "row"
                    from (
                        select species, count(*)
                        from catches
                        where "user" = ?
                        and not species IS NULL
                        group by species
                    ) as spec
                ) q1
                left join (
                    select json_agg(wbs) as waterbody_counts, 1 as "row"
                    from (
                        select waterbody, count(*)
                        from catches
                        where "user" = ?
                        and not waterbody IS NULL
                        group by waterbody
                    ) as wbs
                ) q2
                on q1.row = q2.row
            `,[id, id, id, id])
            const result = rows[0] as CatchStatisticsRes;
            const { species_counts, waterbody_counts } = result;
            return {
                ...result,
                top_species: species_counts ? species_counts[0].species : null,
                total_species: species_counts ? species_counts.length : 0,
                total_waterbodies: waterbody_counts ? waterbody_counts.length : 0
            }
        },
        location_statistics: async ({ id }) => {
            const { rows } = await knex.raw(`
                select wbscounts.jsonarr as waterbody_counts, 
                total.count as total_locations from (
                    select json_agg(wbs) as jsonarr
                    from (
                        select waterbody::int, count('*')
                        from locations
                        where "user" = ?
                        and not waterbody IS NULL
                        group by waterbody
                    ) as wbs
                ) as wbscounts,
                ( select count(*) from locations where "user" = ?) as total
            `,[id, id])
            const result = rows[0] as LocationStatisticsRes;
            return result;
        },
        total_media: async ({ id }) => {
            const { rows } = await knex.raw(`
                select sum(count) as total from (
                    select count(*) from catch_media where "user" = ?
                    union all
                    select count(*) from waterbody_media where "user" = ?
                    union all
                    select count(*) from location_media where "user" = ?
                ) as media
            `,[id, id, id])
            const result = rows[0] as { total: number }
            return result.total;
        },
        media: async ({ id }, { limit, offset }) => {
            const { rows } = await knex.raw(`
                select "id", "user", "key", "url", "created_at" 
                from waterbody_media where "user" = ?
                union all
                select "id", "user", "key", "url", "created_at"
                from catch_media where "user" = ?
                union all
                select "id", "user", "key", "url", "created_at" 
                from location_media where "user" = ?
                order by "created_at" desc offset ? limit ?
            `, [id,id,id,(offset || 0),(limit || 24)])
            return rows;
        },
        total_reviews: async ({ id }) => {
            const [result] = await knex('waterbodyReviews')
                .where('user', id)
                .count()
            const { count } = result;
            if(typeof count === 'number') return count;
            return parseInt(count)
        },
        waterbody_reviews: async ({ id }, { limit, offset, sort }) => {
            const query = knex('waterbodyReviews')
                .where('user', id)
                .limit(limit || 16)
                .offset(offset || 0)
            switch(sort){
                case ReviewSort.CreatedAtNewest:
                    query.orderBy('created_at', 'desc')
                    break;
                case ReviewSort.RatingHighest:
                    query.orderBy('rating', 'desc')
                    break;
                case ReviewSort.RatingLowest:
                    query.orderBy('rating', 'asc')
                    break;
                case ReviewSort.CreatedAtOldest:
                    query.orderBy('created_at', 'asc')
                    break;
                default:
                    query.orderBy('created_at', 'desc')
            }
            const results = await query;
            return results;
        }
    },
    CatchStatistics: {
        top_waterbody: async ({ waterbody_counts }) => {
            if(!waterbody_counts) return null;
            const id = waterbody_counts[0].waterbody
            const result = await knex('waterbodies').where('id', id).first()
            return result;
        },
        largest_catch: async ({ largest_catch }) => {
            if(!largest_catch) return null;
            const result = await knex('catches').where('id', largest_catch).first()
            return result;
        }
    },
    WaterbodyCount: {
        waterbody: async ({ waterbody }) => {
            const result = await knex('waterbodies').where('id', waterbody)
            return result[0];
        }
    }
}