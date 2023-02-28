import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonauthGuard implements CanActivate {
  constructor(private router : Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
      
      let user = localStorage.getItem('userData');

      if (!user) {
        return true;
      } else {
        this.router.navigate(['/page/profile']);
        return false;
      }
  }
  
}
