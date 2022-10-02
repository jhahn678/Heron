import knex from '../configs/knex'
import { AuthenticationError, gql } from 'apollo-server-express'
import { Resolvers, ReviewSort } from '../types/graphql'
import { CatchStatisticsRes, UserDetailsUpdate } from '../types/User'
import { RequestError } from '../utils/errors/RequestError'
import { UploadError } from '../utils/errors/UploadError'
import { validateMediaUrl } from '../utils/validations/validateMediaUrl'

export const typeDef =  gql`
    type User { 
        id: Int!
        firstname: String
        lastname: String
        fullname: String
        username: String!
        avatar: String
        bio: String
        location: String
        city: String
        state: String
        am_following: Boolean!
        follows_me: Boolean!
        following(limit: Int, offset: Int): [User]
        total_following: Int!
        followers(limit: Int, offset: Int): [User]
        total_followers: Int!
        locations: [Location]
        total_locations: Int!
        saved_locations: [Location]
        total_saved_locations: Int!
        catches(
            date: DateRange, 
            species: [String!], 
            waterbody: [Int!], 
            length: Range, 
            weight: Range,
            limit: Int
            offset: Int
        ): [Catch]
        total_catches: Int!
        catch_statistics: CatchStatistics
        saved_waterbodies: [Waterbody]
        total_saved_waterbodies: Int!
        waterbody_reviews(limit: Int, offset: Int, sort: ReviewSort): [WaterbodyReview]
        total_reviews: Int!
        media(limit: Int, offset: Int): [AnyMedia]
        total_media: Int!
        created_at: DateTime!
        updated_at: DateTime!
    }

    type CatchStatistics {
        total_catches: Int!
        largest_catch: Catch
        total_species: Int!
        top_species: String
        species_counts: [SpeciesCount!]
        total_waterbodies: Int!
        top_waterbody: Waterbody
        waterbody_counts: [WaterbodyCount!]
    }

    type WaterbodyCount {
        waterbody: Waterbody!
        count: Int!
    }

    type Query {
        me: User
        user(id: Int!): User
        activityFeed(limit: Int, offset: Int): [Catch]
    }

    type Mutation {
        updateUserDetails(details: UserDetails!): User
        updateUserAvatar(avatar: MediaInput): String
        followUser(id: Int!): Int
        unfollowUser(id: Int!): Int
    }

    input UserDetails {
        firstname: String
        lastname: String
        bio: String
        city: String
        state: String
    }

    input DateRange{
        min: DateTime
        max: DateTime
    }

    input Range {
        min: PositiveInt
        max: PositiveInt
    }
`


export const resolver: Resolvers = {
    Query: {
        me: async (_, __, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Missing')
            const user = await knex('users').where('id', auth).first()
            return user;
        },
        user: async (_, { id } ) => {
            const user = await knex('users').where('id', id)
            return user[0]
        },
        activityFeed: async(_, { limit, offset }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const results = await knex('catches')
                .select('*', knex.raw("st_asgeojson(st_transform(geom, 4326))::json as geom"))
                .whereIn("user", function(){
                    this.from('userFollowers')
                    .select('following')
                    .where('user', auth)
                })
                .orderBy('created_at', 'desc')
                .offset(offset || 0)
                .limit(limit || 10)
            return results;
        }
    },
    Mutation: {
        updateUserDetails: async (_, { details }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const update: UserDetailsUpdate = {};
            const { firstname, lastname, city, state, bio } = details;
            if(firstname) update.firstname = firstname;
            if(lastname) update.lastname = lastname;
            if(state) update.state = state;
            if(city) update.city = city;
            if(bio) update.bio = bio;
            const [result] = await knex('users')
                .where({ id: auth })
                .update({ ...update })
                .returning('*')
            if(!result) throw new RequestError('TRANSACTION_NOT_FOUND')
            return result;
        },
        updateUserAvatar: async (_, { avatar }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            if(!avatar){
                await knex('userAvatars').where('user', auth).del()
                await knex('users').where('id', auth).update('avatar', null)
                return null;
            }
            if(!validateMediaUrl(avatar.url)) throw new UploadError('INVALID_URL')
            const [{ url }] = await knex('userAvatars')
                .insert({ ...avatar, user: auth })
                .onConflict('user')
                .merge(['key', 'url'])
                .returning('url')
            if(!url) throw new RequestError('TRANSACTION_NOT_FOUND')
            await knex('users').where({ id: auth }).update({ avatar: url })
            return url;
        },
        followUser: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            await knex('userFollowers')
                .insert({ user: auth, following: id })
                .onConflict(['user', 'following'])
                .ignore()
            return id;
        },
        unfollowUser: async (_, { id }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            await knex('userFollowers')
                .where({ user: auth, following: id })
                .del()
            return id;
        }
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
        locations: async ({ id }, __, { auth }) => {
            if(auth !== id) throw new AuthenticationError('Unauthorized')
            const locations = await knex('locations')
                .where('user', id)
                .orderBy('created_at', 'desc')
            return locations;
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
            const res = await knex('locations').where('user', id).count()
            const { count } = res[0];
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        saved_locations: async ({ id }) => {
            const results = await knex('locations')
                .whereRaw(` "id" in (
	                select "location" 
                    from saved_locations 
                    where "user" = ?
                )`, [id])
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
        saved_waterbodies: async ({ id }) => {
            const results = await knex('waterbodies')
                .whereRaw(` "id" in (
	                select "waterbody" 
                    from saved_waterbodies
                    where "user" = ?
                `,[id])
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
                        select species, count(species)
                        from catches
                        where "user" = ?
                        group by species
                    ) as spec
                ) q1
                left join (
                    select json_agg(wbs) as waterbody_counts, 1 as "row"
                    from (
                        select waterbody, count(waterbody)
                        from catches
                        where "user" = ?
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
