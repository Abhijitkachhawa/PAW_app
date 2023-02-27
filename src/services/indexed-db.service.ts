import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db!: IDBPDatabase<any>;
  constructor() {
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB<any>('my-db', 1, {
      upgrade(db) {
        db.createObjectStore('user');
      },
    });
  }

  addUser(data: any) {
    return this.db.put('user', JSON.stringify(data), data.email);
  }

  deleteUser(key: string) {
    return this.db.delete('user', key);
  }
}

// interface MyDB extends DBSchema {
//   'user': {
//     key: string;
//     value: string;
// //   };
// }
