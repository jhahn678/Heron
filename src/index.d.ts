declare module 'jsonwebtoken' {
  interface JwtPayload {
      id: number,
      jti?: string
  }
}
