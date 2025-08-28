import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpCLient = inject(HttpClient);

  registerForm(body: object): Observable<any> {
    return this.httpCLient.post(environment.baseUrl + 'auth/signup', body);
  }

  loginForm(body: object): Observable<any> {
    return this.httpCLient.post(environment.baseUrl + 'auth/signin', body);
  }
}
