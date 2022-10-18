export interface IRefreshToken {
    user: number,
    jwtid: string
}

export enum LinkedAccount {
    Apple = 'apple',
    Google = 'google',
    Facebook = 'facebook'
}