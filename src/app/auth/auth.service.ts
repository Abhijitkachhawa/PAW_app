import { IndexedDBService } from './../../services/indexed-db.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient,
    private indexDBService : IndexedDBService) { }

  register(data:any){
   return  this.http.post(" ",data)
}
}
