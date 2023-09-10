// DTO layer: DTO or types, we often import this from GraphQL codegen
export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export type Auth = {
  token: string, // jwt token
  refresh_token: string,
  token_expire_at?: number, // millisecs
  user: User,
}
