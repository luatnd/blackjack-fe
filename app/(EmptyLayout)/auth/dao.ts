// DAO layer (data fetching layer): fetch data from REST, socket, localstorage, ...

import {User} from "./model";
import {post} from "@/services/AppApi";
// import AppDb from "@/services/AppDb";

export enum AuthDataSource {
  // Local = 'Local',
  GraphQL = 'GraphQL',
  REST = 'REST',
}


interface DataSourceAdapter {
  getUser(email: string, pw: string): Promise<User | undefined>;
  createUser(email: string, pw: string): Promise<User | undefined>;
}

export class AuthDAO {
  // actually this would be a strategy, but each strategy here will use an Adapter
  // So we use adapter directly for short
  private adapter: DataSourceAdapter;

  constructor(dataSource: AuthDataSource) {
    this.adapter = this.getAdapter(dataSource);
  }

  private getAdapter(dataSource: AuthDataSource): DataSourceAdapter {
    switch (dataSource) {
      // case AuthDataSource.Local:
      //   return new LocalDataSourceAdapter();
      case AuthDataSource.GraphQL:
        return new GraphQLDataSourceAdapter();
      case AuthDataSource.REST:
        return new RESTDataSourceAdapter();
      default:
        throw new Error('Invalid data source');
    }
  }

  async getUser(email: string, pw: string): Promise<User | undefined> {
    return this.adapter.getUser(email, pw);
  }
  async createUser(email: string, pw: string): Promise<User | undefined> {
    return this.adapter.createUser(email, pw);
  }
}



class GraphQLDataSourceAdapter implements DataSourceAdapter {
  async getUser(email: string, pw: string): Promise<User | undefined> {
    return undefined
  }
  async createUser(email: string, pw: string): Promise<User | undefined> {
    return undefined
  }
}

class RESTDataSourceAdapter implements DataSourceAdapter {
  async getUser(email: string, pw: string): Promise<User | undefined> {
    const r = await post("/api/v1/auth/email/login", {
      "body": JSON.stringify({
        email,
        password: pw,
      }),
    }, true)
    if (r.ok) {
      return {
        ...r.body.user,
        token: r.body.token,
        refresh_token: r.body.refreshToken,
        token_expire_at: r.body.tokenExpires,
      }
    }

    return undefined
  }

  async createUser(email: string, pw: string): Promise<User | undefined> {
    const r = await post("/api/v1/auth/email/register", {
      "body": JSON.stringify({
        email,
        password: pw,
        firstName: email,
        lastName: "Demo",
      }),
    }, true)
    if (r.ok) {
      return undefined
    }

    return undefined
  }
}

// class LocalDataSourceAdapter implements DataSourceAdapter {
//   db = AppDb;
//
//   async getUser(email: string, pw: string): Promise<User | undefined> {
//     const u = await this.db.users.get({email}) // Demo: login by username without password
//     if (u) delete u.password;
//
//     return u
//   }
//   async createUser(email: string, pw: string): Promise<User | undefined> {
//     const u = {email, password: pw}
//     const id = await this.db.users.add(u)
//     // console.log('{createUser} user: ', u);
//     // @ts-ignore
//     u.id = id;
//     // @ts-ignore
//     delete u.password;
//
//     return u;
//   }
// }

