import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private router:Router) {  }

  getToken():string | null{
    return sessionStorage.getItem('token');
  }

  getDecodedToken():any{
    const token=this.getToken();
    return token?jwtDecode(token):null;
  }

  isLoggedIn():boolean{
    const token=this.getToken();
    if (!token){
      return false;
    } 

    const decoded:any=jwtDecode(token);
    const isExpired=decoded.exp*1000<Date.now();
    return !isExpired;
  }


  getUserRoles():string[]{
    const decoded=this.getDecodedToken();
    return decoded?.role || [];
  }

  logout(){
    sessionStorage.removeItem('token');
    this.router.navigate(['/loginpage'])
  }

}
