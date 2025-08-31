import { CanActivateFn,ActivatedRouteSnapshot,Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService=inject(Auth);
  const router=inject(Router);

  const allowedRoles=route.data['roles'] as string[];
  const userRoles=authService.getUserRoles();

  const isLoggedIn=authService.isLoggedIn();

  if ((!isLoggedIn || !userRoles)) {
    alert("You are not authorized to access this page")
    router.navigate(['/loginpage']);
    return false;
  }

  const hasAccess=userRoles.some(role=>allowedRoles.includes(role))

  if (!hasAccess) {
    alert("You are not authorized to access this page")
    router.navigate(['/loginpage'])
    return false;
  }
  return true;
};
