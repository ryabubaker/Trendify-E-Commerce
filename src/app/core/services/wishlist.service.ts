import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  constructor(private httpClient: HttpClient) {}

  wishList: any[] = [];

  whisListCount: WritableSignal<number> = signal(0);

  refreshWishlistCount(): void {
    this.getLoggedUserWishList().subscribe({
      next: (res) => {
        this.wishList = res?.data ?? [];
        this.whisListCount.set(res?.count ?? this.wishList.length ?? 0);
      },
      error: () => this.whisListCount.set(0),
    });
  }

  addProductToWishList(id: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}wishlist`, {
      productId: id,
    });
  }

  getLoggedUserWishList(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}wishlist`);
  }

  fetchWishListItems(): void {
    this.getLoggedUserWishList().subscribe({
      next: (res) => {
        this.wishList = res.data;
        console.log(this.wishList);
      },
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishList.some((product) => product.id === productId);
  }

  removeProductFromWishList(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}wishlist/${id}`);
  }
}
