import { IMedia }from './Media'
import { ICatch } from './Catch'
import { ILocation } from './Location'

export interface IUser {
    _id: string,
    details: UserDetails
    account: UserAccount
    contacts: string[]
    pending_contacts: PendingContact[]
    locations: ILocation[]
    catches: ICatch[]
    media: IMedia[]
    createdAt: Date
    updatedAt: Date
}

interface UserDetails {
    firstName: string,
    lastName: string,
    fullName: string,
    username: string,
    avatar: IMedia,
    bio: string,
    location: string
}

interface UserAccount {
    email: string
    phone: number
    googleId: string
    facebookId: string
    password: string
}

export interface PendingContact {
    user: string,
    status: 'TO' | 'FROM'
    createdAt: Date
}