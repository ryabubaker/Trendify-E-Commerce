import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  getAllProducts(): Observable<any> {
    return this.http.get('https://ecommerce.routemisr.com/api/v1/products');
  }
}
