import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.userSignal());
  isLoggedIn = computed(() => !!this.auth.tokenSignal());

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  
}
