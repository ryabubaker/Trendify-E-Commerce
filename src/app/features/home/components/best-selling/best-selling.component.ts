// best-selling.component.ts
import { ProductsService } from './../../../../core/services/products/products.service';
import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../core/models/product.interface';
import { WishListService } from '../../../../core/services/wishlist.service';

// Define an interface for the tabs for better type safety
interface Tab {
  title: string;
  id: string;
}

@Component({
  selector: 'app-best-selling',
  standalone: true, // Assuming this is a standalone component
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './best-selling.component.html',
  styleUrls: ['./best-selling.component.css'],
})
export class BestSellingComponent implements OnInit {
  private readonly categoryService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  readonly wishListService = inject(WishListService);

  tabs: Tab[] = [];
  products: Product[] = [];
  activeTab: string = 'all';

  private productsCache: { [key: string]: Product[] } = {};

  ngOnInit() {
    this.loadCategoriesAndInitialProducts();
    this.wishListService.fetchWishListItems();
  }

  loadCategoriesAndInitialProducts(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        const allowed = ["Men's Fashion", "Women's Fashion", 'Electronics'];

        this.tabs = [
          { title: 'All', id: 'all' },
          ...res.data
            .filter((c: any) => allowed.includes(c.name))
            .map((c: any) => ({ title: c.name, id: c._id })),
        ];

        this.fetchProducts(this.activeTab);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  fetchProducts(categoryId: string): void {
    if (this.productsCache[categoryId]) {
      this.products = this.productsCache[categoryId];
      return;
    }

    const params: Record<string, string | number> = {
      limit: 4,
      sort: '-sold',
    };

    if (categoryId !== 'all') {
      params['category[in]'] = categoryId;
    }

    this.productsService.getProducts(params).subscribe({
      next: (res) => {
        const fetchedProducts = res.data;
        this.products = fetchedProducts;
        this.productsCache[categoryId] = fetchedProducts;
      },
      error: (err) => {
        console.error(
          `Error fetching products for category ${categoryId}:`,
          err
        );
        this.products = [];
      },
    });
  }

  filterByCategory(categoryId: string): void {
    this.activeTab = categoryId;
    this.fetchProducts(categoryId);
  }
}
