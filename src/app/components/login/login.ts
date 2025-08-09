import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  usernameOrEmail = '';
  password = '';
  constructor(private authService:AuthService, private router:Router){
  }
  onSubmit(){
    this.authService.login({
      usernameOrEmail: this.usernameOrEmail,
      password: this.password
    })
    .subscribe({
      next: (res) => {
       if(res.status === 'success'){
        console.log(res);
        this.authService.setAuthData(
          res.data.jwtToken,
          res.data.refreshTokenDto.refreshToken,
          res.data.user
        );
          // Get roles from the response
          const roles: string[] = res.data.user.roles.map((roleObj: any) =>
            typeof roleObj === 'string' ? roleObj : roleObj.name || ''
          );

          // Redirect based on role
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin']);
          } else if (roles.includes('ROLE_NORMAL')) {
            this.router.navigate(['/user']);
          }else if(roles.includes('ROLE_WORKER')){
            this.router.navigate(['/worker']);
          } else {
            this.router.navigate(['/']);
          }

       } else{
        alert(res.message);
       }
       
      },
      error: (err) => {
        if (err.error && err.error.errorMessage) {
          alert(err.error.errorMessage); // e.g. "Invalid username or password"
        } else if (err.error && err.error.message) {
          alert(err.error.message);
        } else {
          alert('Login failed. Please try again.');
        }
      }
    })
  }

}
