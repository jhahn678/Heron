export interface IUser {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    avatar: string,
    bio: string,
    location: string
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

export interface IContact {
    user_one: number,
    user_two: number
}


export interface IPendingContact {
    user_sending: number,
    user_recipient: number,
    created_at: Date
}
