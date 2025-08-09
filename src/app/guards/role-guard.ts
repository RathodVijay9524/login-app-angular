import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAccess(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAccess(childRoute);
  }

  private checkAccess(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      console.log('🔐 User not logged in');
      this.router.navigate(['/login']);
      return false;
    }
  
    const allowedRoles: string[] = route.data?.['roles'] ?? [];
    const userRoles: string[] = this.auth.getRoles();
  
    console.log('🔍 Allowed Roles:', allowedRoles);
    console.log('👤 User Roles:', userRoles);
  
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));
  
    if (!hasAccess) {
      console.log('⛔ Access denied');
      this.router.navigate(['/unauthorized']);
    }
  
    return hasAccess;
  }
}



