import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: { name: string }[];
  // Add any other fields returned from backend
}

interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  responseStatus: string;
  status: string;
  message: string;
  data: {
    jwtToken: string;
    refreshTokenDto: {
      id: number;
      refreshToken: string;
      expiryDate: string;
      username: string;
      email: string;
      userId: number;
      workerId: number | null;
    };
    user: User;
  };
}

interface RefreshTokenResponse {
  jwtToken: string;
  refreshTokenDto: {
    id: number;
    refreshToken: string;
    expiryDate: string;
    username: string;
    email: string;
    userId: number;
    workerId: number | null;
  };
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:9091/api/auth/login';
  private apiReffressUrl = 'http://localhost:9091/api/v1/tokens';

  // 🔹 Signals for state
  userSignal = signal<User | null>(null);
  tokenSignal = signal<string | null>(null);
  refreshTokenSignal = signal<string | null>(null);

  constructor(private http: HttpClient) {

    const jwtToken = localStorage.getItem('jwtToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');
    if (jwtToken && user) {
      this.tokenSignal.set(jwtToken);
      this.refreshTokenSignal.set(refreshToken);
      this.userSignal.set(JSON.parse(user));
    }
  }
  login(user: LoginRequest) {
    return this.http.post<LoginResponse>(this.apiUrl, user);
  }
  setAuthData(token: string, refreshToken: string, user?: User | null) {
    if (!user) return; // optional safeguard
    console.log(" refreshToken ", refreshToken);
    console.log(" token : ", token);
    console.log("user :", user);
    this.tokenSignal.set(token);
    this.refreshTokenSignal.set(refreshToken);
    this.userSignal.set(user);

    localStorage.setItem('jwtToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }


  refreshToken(): Observable<RefreshTokenResponse> {
    const storedRefreshToken = this.refreshTokenSignal();
    if (!storedRefreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<RefreshTokenResponse>(`${this.apiReffressUrl}/regenerate-token`, {
      refreshToken: storedRefreshToken
    }).pipe(
      tap(res => {
        const existingUser = this.getUser();
        this.setAuthData(res.jwtToken, res.refreshTokenDto.refreshToken, existingUser);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  getUser() {
    const userJson = localStorage.getItem('user'); // string key, not this.user
    return userJson ? JSON.parse(userJson) : null;
  }

  getRoles(): string[] {
    const user = this.getUser();
    return user.roles ? user.roles.map((r: any) => r.name) : [];
  }
  
  

  hasRole(role: string): boolean {
    const user = this.getUser();
    if (!user || !user.roles) return false;
    return user.roles.some(
      (r: any) => r === role || r.name === role
    );
  }

    // Check if logged in & token not expired
    isLoggedIn(): boolean {
      const token = localStorage.getItem('jwtToken');
      if (!token) return false;
  
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const expiry = payload.exp * 1000; // Convert to ms
        return Date.now() < expiry; // True if still valid
      } catch (e) {
        return false; // Invalid token
      }
    }
  

  logout() {
    this.tokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}
