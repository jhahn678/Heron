import { AuthenticationError, gql } from 'apollo-server-express'
import knex from '../configs/knex'
import { Resolvers } from '../types/graphql'
import { CatchStatistics, IPendingContact } from '../types/User'
import { RequestError } from '../utils/errors/RequestError'
import { removeUndefined } from '../utils/validations/removeUndefined'

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
        contacts: [User]
        total_contacts: Int
        pending_contacts: [PendingContact]
        locations: [Location]
        total_locations: Int
        catches(
            date: DateRange, 
            species: [String!], 
            waterbody: [Int!], 
            length: Range, 
            weight: Range,
            limit: Int
            offset: Int
        ): [Catch]
        total_catches: Int
        catch_statistics: CatchStatistics
        saved_waterbodies: [Waterbody]
        created_at: DateTime
        updated_at: DateTime
    }

    type CatchStatistics {
        total_catches: Int!
        total_species: Int!
        top_species: String
        all_species: [String]
        total_waterbodies: Int!
        all_waterbodies: [Waterbody!]
        top_waterbody: Waterbody
        largest_catch: Catch
    }

    type Query {
        me: User
        user(id: Int!): User
        activityFeed(limit: Int, offset: Int): [Catch]
    }

    type Mutation {
        updateUserDetails(details: UserDetails!): User
        updateUserAvatar(url: String!): User
        deleteContact(id: Int!): Int
    }

    input UserDetails {
        firstname: String
        lastname: String
        bio: String
        location: String
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
                .whereIn('user', function(){
                    this.from('contacts')  
                        .select('user_one as user')
                        .join('users', 'contacts.user_one', '=', 'users.id')
                        .where('contacts.user_two', '=', auth)
                        .unionAll(function() {
                            this.from('contacts')
                                .select('user_two as user')
                                .join('users', 'contacts.user_two', '=', 'users.id')
                                .where('contacts.user_one', '=', auth)
                        })
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
            if(typeof details === undefined) throw new RequestError('REQUEST_UNDEFINED')
            const update = removeUndefined(details)
            const res = await knex('users').where({ id: auth }).update(update).returning('*')
            if(res.length === 0) throw new RequestError('TRANSACTION_NOT_FOUND')
            return res[0];
        },
        updateUserAvatar: async (_, { url }, { auth }) => {
            if(!auth) throw new AuthenticationError('Authentication Required')
            const res = await knex('users').where({ id: auth }).update({ avatar: url }).returning('*')
            return res[0]; 
        },
        deleteContact: async (_, { id }, { auth }) => {
            if(auth !== id) throw new AuthenticationError('Unauthorized')
            const user_one = id < auth ? id : auth;
            const user_two = id < auth ? auth : id;
            const res = await knex('contacts')
                .where({ user_one, user_two })
                .del().returning('*')
            if(res.length === 0) throw new RequestError('DELETE_NOT_FOUND')
            return id;
        },
    },
    User: {
        fullname: ({ firstname, lastname }) => `${firstname} ${lastname}`,
        contacts: async ({ id }) => {
            const contacts = await knex('contacts')
                .select('users.*')
                .join('users', 'contacts.user_two', '=', 'users.id')
                .where('contacts.user_one', id)
                .unionAll(function(){
                    this.select('users.*')
                    .from('contacts')
                    .join('users', 'contacts.user_one', '=', 'users.id')
                    .where('contacts.user_two', id)
                })
            return contacts;
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
        pending_contacts: async ({ id }, _, { auth }) => {
            if(auth !== id) throw new AuthenticationError('Unauthorized')
            const pending: IPendingContact[] = await knex('pendingContacts')
                .where('user_recipient', id)
                .unionAll(function(){
                    this.select('*').from('pendingContacts').where('user_sending', id)
                })
            return pending;
        },
        total_contacts: async ({ id }) => {
            const res = await knex('contacts').where('user_one', id).orWhere('user_two', id).count()
            const { count } = res[0];
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        total_locations: async ({ id }) => {
            const res = await knex('locations').where('user', id).count()
            const { count } = res[0];
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        total_catches: async ({ id }) => {
            const res = await knex('catches').where('user', id).count()
            const { count } = res[0];
            if(typeof count === 'string') return parseInt(count);
            return count;
        },
        saved_waterbodies: async ({ id }) => {
            const res = await knex('savedWaterbodies').where({ user: id })
            const ids = res.map(x => x.waterbody)
            if(ids.length === 0) return [];
            return (await knex('waterbodies').whereIn('id', ids))
        },
        catch_statistics: async ({ id }) => {
            const [result] = await knex('catches')
                .where('user', id)
                .select(knex.raw(`
                    count(*)::int as total_catches, 
                    array_agg(distinct species) as all_species,
                    count(distinct species)::int as total_species,
                    count(distinct waterbody)::int as total_waterbodies,
                    array_agg(distinct waterbody) as all_waterbodies,
                    (
                        select species from catches
                        where "user" = ?
                        group by species
                        order by count(*) desc
                        limit 1
                    ) as top_species,
                    (
                        select waterbody from catches 
                        where "user" = ? 
                        group by waterbody 
                        order by count(*) desc 
                        limit 1
                    ) as top_waterbody,
                    (
                        select "id" from catches
                        where "user" = ?
                        and "length" IS NOT NULL
                        order by "length" desc
                        limit 1
                    ) as largest_catch
                `,[id, id, id])) as CatchStatistics[]
            // console.log(result)
            return result;
        }
    },
    CatchStatistics: {
        all_waterbodies: async ({ all_waterbodies }) => {
            if(!all_waterbodies) return null;
            const result = await knex('waterbodies')
                .whereIn('id', all_waterbodies)
            return result;
        },
        top_waterbody: async ({ top_waterbody }) => {
            const result = await knex('waterbodies').where('id', top_waterbody).first()
            return result;
        },
        largest_catch: async ({ largest_catch }) => {
            const result = await knex('catches').where('id', largest_catch).first()
            return result;
        }
    }
}
