import { ProductsService } from './../../../../core/services/products/products.service';
import { Component, inject } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-best-selling',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './best-selling.component.html',
  styleUrl: './best-selling.component.css',
})
export class BestSellingComponent {
  private readonly categoryService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);

  tabs: { title: string; id: string }[] = [];
  activeTab: string = 'all';

  productsByCategory: { [key: string]: any[] } = {};

  get products() {
    return this.productsByCategory[this.activeTab] || [];
  }

  ngOnInit() {
    this.loadCategoriesAndProducts();
  }

  loadCategoriesAndProducts() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        const allowed = ["Men's Fashion", "Women's Fashion", 'Electronics'];

        this.tabs = [
          { title: 'All', id: 'all' },
          ...res.data
            .filter((c: any) => allowed.includes(c.name))
            .map((c: any) => ({
              title: c.name,
              id: c._id,
            })),
        ];

        // Prefetch products only if not already cached
        this.tabs.forEach((tab) => {
          if (!this.productsByCategory[tab.id]) {
            this.fetchProducts(tab.id);
          }
        });

        console.log(this.productsByCategory);
      },
      error: (err) => console.error(err),
    });
  }

  fetchProducts(categoryId: string) {
    const params =
      categoryId === 'all'
        ? { limit: 4, sort: '-sold' }
        : { limit: 4, sort: '-sold', 'category[in]': categoryId };

    this.productsService.getProducts(params).subscribe((res) => {
      this.productsByCategory[categoryId] = res.data;
    });
  }

  filterByCategory(categoryId: string) {
    this.activeTab = categoryId;

    // Optional: lazy-load if category not fetched yet
    if (!this.productsByCategory[categoryId]) {
      this.fetchProducts(categoryId);
    }
  }
}
