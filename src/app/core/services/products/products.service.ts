import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
export interface ProductFilter {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  keyword?: string;
  sort?: string; // e.g., 'price' | '-price'
  priceGte?: number;
  priceLte?: number;
  fields?: string;
}
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl + 'products';

  getProducts(filter: ProductFilter = {}): Observable<any> {
    let httpParams = new HttpParams();

    // Map filter keys into API query params
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        switch (key) {
          case 'priceGte':
            httpParams = httpParams.set('price[gte]', value.toString());
            break;
          case 'priceLte':
            httpParams = httpParams.set('price[lte]', value.toString());
            break;
          case 'category':
            httpParams = httpParams.set('category[in]', value.toString());
            break;
          default:
            httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return this.http.get<any>(this.baseUrl, { params: httpParams });
  }

  getDetailsOfProduct(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/' + id);
  }
}
