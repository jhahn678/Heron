export interface IRefreshToken {
    user: number,
    jwtid: string
}

export enum LinkedAccount {
    Apple = 'apple',
    Google = 'google',
    Facebook = 'facebook'
}

export interface IPasswordResetToken {
    token: string
    user: number
    created_at: Date
}

export enum AuthCookie{
    accessToken = 'ACCESS_TOKEN',
    refreshToken = 'REFRESH_TOKEN'
}