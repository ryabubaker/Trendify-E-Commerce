import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);

  
  cartNumber = signal(0); 
  CartPrice: number = 1000;

  constructor() {
    this.refreshCartCount(); 
  }

  private calculateTotalItems(cart: any): number {
    const products = cart?.data?.products ?? [];
    return products.reduce(
      (sum: number, item: any) => sum + Number(item.count || 0),
      0
    );
  }

  // ---- REFRESH ----
  refreshCartCount(): void {
    this.getLoggedUserCart().subscribe({
      next: (res) =>
        this.cartNumber.set(this.calculateTotalItems(res)),
      error: () => this.cartNumber.set(0),
    });
  }

  // ---- API ----
  addProductToCart(id: string): Observable<any> {
    return this.httpClient
      .post(`${environment.baseUrl}cart`, { productId: id })
      .pipe(
        tap(() => this.refreshCartCount())
      );
  }

  removeSpicificCartItem(id: string): Observable<any> {
    return this.httpClient
      .delete(`${environment.baseUrl}cart/${id}`)
      .pipe(tap(() => this.refreshCartCount()));
  }

  updataCartProductQuntity(id: string, newCount: number): Observable<any> {
    return this.httpClient
      .put(`${environment.baseUrl}cart/${id}`, { count: newCount })
      .pipe(tap(() => this.refreshCartCount()));
  }

  clearCart(): Observable<any> {
    return this.httpClient
      .delete(`${environment.baseUrl}cart`)
      .pipe(tap(() => this.cartNumber.set(0)));
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}cart`);
  }
}
