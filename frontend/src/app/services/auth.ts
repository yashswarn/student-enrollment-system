import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private router: Router) {}

  private rolesSubject = new BehaviorSubject<string[]>(this.getUserRoles());
  roles$ = this.rolesSubject.asObservable();

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const decoded: any = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    return !isExpired;
  }

  getUserRoles(): string[] {
    const roles = sessionStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  getRoles(): string[] {
    return this.rolesSubject.value;
  }

  setUserRoles(roles: string[]): void {
    sessionStorage.setItem('roles', JSON.stringify(roles));
    this.rolesSubject.next(roles);
  }

  logout() {
    sessionStorage.clear();
    this.rolesSubject.next([]);
    this.router.navigate(['/loginpage']);
  }
}
