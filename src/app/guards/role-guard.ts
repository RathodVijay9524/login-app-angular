import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    // Check login status
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get allowed roles from route config
    const allowedRoles: string[] = route.data?.roles || [];

    // Get logged-in user's roles
    const userRoles = this.auth.getRoles();

    // Check if user has at least one allowed role
    if (allowedRoles.some(role => userRoles.includes(role))) {
      return true;
    }

    // No matching role — redirect
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
