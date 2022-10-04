import { ICatch } from "./Catch"
import { Maybe, ResolverTypeWrapper } from "./graphql"
import { IWaterbody } from "./Waterbody"

export interface IUser {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    avatar: string,
    bio: string,
    city: string,
    state: string,
    email: string
    phone: number
    google_id: string
    facebook_id: string
    password: string
    created_at: Date
    updated_at: Date
}


export interface UserAvatar {
    id: number,
    key: string,
    url: string,
    user: number,
    created_at: Date
}

export interface IUserFollowers {
    user: number
    following: number
}

export interface IContact {
    user_one: number,
    user_two: number
}


export interface CatchStatisticsRes {
    species_counts: {
        species: string
        count: number
    }[] | null,
    waterbody_counts: {
        waterbody: ResolverTypeWrapper<IWaterbody>
        count: number
    }[] | null,
    total_catches: number
    largest_catch: Maybe<ResolverTypeWrapper<ICatch>>
}


export interface CatchStatistics {
    total_catches: number
    total_species: number
    total_waterbodies: number
    all_waterbodies: Maybe<Array<ResolverTypeWrapper<IWaterbody>>>
    top_species: Maybe<string>,
    top_waterbody: Maybe<ResolverTypeWrapper<IWaterbody>>
    largest_catch: Maybe<ResolverTypeWrapper<ICatch>>
}

export interface LocationStatisticsRes {
    total_locations: number
    waterbody_counts: {
        waterbody: ResolverTypeWrapper<IWaterbody>
        count: number
    }[] | null,
}


export interface UserDetailsUpdate {
    firstname?: string
    lastname?: string
    state?: string
    city?: string
    bio?: string
}