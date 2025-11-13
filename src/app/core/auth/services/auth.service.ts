// core/auth/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

type ChangePasswordBody = {
  currentPassword: string;
  password: string;
  rePassword: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookies = inject(CookieService);
  private readonly router = inject(Router);

  private _isAuthenticated = signal<boolean>(this.cookies.check('token'));
  isAuthenticated = this._isAuthenticated.asReadonly();

  userToken: any | null = null;

  saveUserData(): void {
    const token = this.cookies.get('token');
    if (!token) {
      this.userToken = null;
      this._isAuthenticated.set(false);
      return;
    }
    this.userToken = jwtDecode(token);
    const name = this.userToken?.name ?? '';
    if (name) this.cookies.set('InfoUser', name);
    this._isAuthenticated.set(true);
  }

  registerForm(body: object): Observable<any> {
    return this.http.post(environment.baseUrl + 'auth/signup', body);
  }

  loginForm(body: object): Observable<any> {
    return this.http.post(environment.baseUrl + 'auth/signin', body);
  }

  forgotPassword(data:object):Observable<any> {
    return this.http.post(environment.baseUrl+`auth/forgotPasswords` , data);
  }

  verifyResetCode(data:object):Observable<any> {
    return this.http.post(environment.baseUrl +`auth/verifyResetCode` , data);
  }

  resetNewPassword(data:object):Observable<any> {
    return this.http.put(environment.baseUrl +`auth/resetNewPassword` , data);
  }

    changePassword(data:Object):Observable<any> {
    return this.http.put( environment.baseUrl +`users/changeMyPassword` , data);
  }
  
  logout() {
    this.cookies.delete('token', '/');
    this.cookies.delete('InfoUser', '/');
    this.userToken = null;
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
