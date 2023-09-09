// DTO layer: DTO or types, we often import this from GraphQL codegen
export interface User {
  id?: number;
  email: string;
  password?: string;
}

export type Auth = {
  token: string, // jwt token
  refresh_token: string,
  user: User,
}
