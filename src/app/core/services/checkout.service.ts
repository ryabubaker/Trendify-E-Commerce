import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private httpClient: HttpClient) {}

  addAddress(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}addresses`, data);
  }

  getLoggedUserAddress(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}addresses`);
  }

  removeAddress(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}addresses/${id}`);
  }

  getSpacificAddress(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}addresses/${id}`);
  }

  checkOutSession(data: any, id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}orders/checkout-session/${id}?url=https;//localhost:4200/`,
      {
        shippingAddress: data,
      }
    );
  }

  cashOrder(data: any, id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}orders/${id}`,

      {
        shippingAddress: data,
      }
    );
  }
}
