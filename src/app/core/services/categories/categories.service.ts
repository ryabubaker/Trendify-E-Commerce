import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Category } from '../../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  private categoriesCache: Category[] | null = null;

  getAllCategories(): Observable<{ data: Category[] }> {
    if (this.categoriesCache) {
      return of({ data: this.categoriesCache });
    }

    return this.httpClient
      .get<{ data: Category[] }>(`${environment.baseUrl}categories`)
      .pipe(
        tap((res) => {
          this.categoriesCache = res.data;
        })
      );
  }

  getCategoryById(id: string): Observable<{ data: Category }> {
    if (this.categoriesCache) {
      const category = this.categoriesCache.find((c) => c._id === id);
      if (category) {
        return of({ data: category });
      }
    }

    return this.httpClient.get<{ data: Category }>(
      `${environment.baseUrl}categories/${id}`
    );
  }

  getSubCategoriesByCategoryId(categoryId: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}categories/${categoryId}/subcategories`
    );
  }
}
