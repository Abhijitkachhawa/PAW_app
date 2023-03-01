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
        db.createObjectStore('profile');
        db.createObjectStore('user');
       
      },
      
    });
  }

  addUser(data: any) {
    return this.db.put('user',data, data.email);
  }
  addProfile(data: any) {
    return this.db.put('profile', data, data.email);
  }

  deleteUser(key: string) {
    return this.db.delete('user', key);
  }
  
  getDBDate(table:string,key:string){

    return new Promise((resolve, reject) => { 


            let userProfileData;
            const request = indexedDB.open('my-db');
            request.onerror = (event) => {
              console.log('Please allow my web app to use IndexedDB 😃>>>👻');
            };
            request.onsuccess =  (event:any) => {
             const db = event.target.result;
             const transaction = db.transaction([table]);
             const objectStore = transaction.objectStore(table);
             const request = objectStore.get(key);
             request.onerror = (errEvent:any) => {
               // Handle errors!
             };
             request.onsuccess = (succEvent:any) => {
               // Do something with the request.result!
               userProfileData = request?.result

               resolve(userProfileData); 
             };
            }; 
     
  }); 


 
}
}


// interface MyDB extends DBSchema {
//   'user': {
//     key: string;
//     value: string;
// //   };
// }
