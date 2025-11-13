import { CookieService } from 'ngx-cookie-service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  const cookie = inject(CookieService);

  if(cookie.get("token"))
  {
    req = req.clone({
  
      setHeaders:{
        token:cookie.get("token")!
      }
  
    })
  }



  return next(req);
};