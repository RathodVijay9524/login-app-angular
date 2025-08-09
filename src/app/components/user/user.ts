import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.userSignal());
  isLoggedIn = computed(() => !!this.auth.tokenSignal());

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
