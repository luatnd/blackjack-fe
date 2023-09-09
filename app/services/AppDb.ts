import Dexie, {Table} from 'dexie';

export interface User {
  id?: number;
  email: string;
  password?: string;
}

export interface Seller {
  id?: number;
  // owner user id, it can be 1-1 (1 user has 1 seller profile),
  // but 1-n is safe for all the cases
  user_id: number,
  name: string;
  phone: string;
  description: string;
  cover_image: string;
  products: Product[];
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: number;
  order: number;
}

// Simulate our db in IndexedDb
class AppDb extends Dexie {
  users!: Table<User>;
  sellers!: Table<Seller>;

  constructor() {
    super('MyAppDb');
    this.version(11).stores({
      users: '++id, email',
      sellers: '++id, user_id',
    });
  }
}

export default new AppDb();
