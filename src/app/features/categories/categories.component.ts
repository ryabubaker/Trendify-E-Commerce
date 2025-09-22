import {
  Component,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CategoriesService } from '../../core/services/categories/categories.service';
import {
  ProductFilter,
  ProductsService,
} from '../../core/services/products/products.service';
import { Product } from './../../core/models/product.model';
import { Category } from '../../core/models/category.interface';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

// PrimeNG Imports
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    BreadcrumbComponent,
    DrawerModule,
    ButtonModule,
    RippleModule,
    AccordionModule,
    MenuModule,
    PaginatorModule,
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild('menu') menu!: Menu;

  public visible: boolean = false;
  public dataDone = false;

  // Pagination State
  public pageSize = 12;

  // Active Filter State
  public filters: ProductFilter = {
    page: 1,
    limit: 12,
    sort: '',
    category: 'all',
  } as ProductFilter;

  public products: Product[] = [];
  public categories: Category[] = [];
  public productCount = 0;
  public categoryName = 'All Products';
  public activeCategoryId: string = 'all';

  public sortBy: MenuItem[] = [
    {
      label: 'High To Low',
      icon: 'fa-solid fa-arrow-down-wide-short',
      sortKey: '-price',
      command: () => this.setSortBy('-price'),
    },
    {
      label: 'Low To High',
      icon: 'fa-solid fa-arrow-up-wide-short',
      sortKey: 'price',
      command: () => this.setSortBy('price'),
    },
    {
      label: 'Default',
      icon: 'fa-solid fa-xmark',
      sortKey: '',
      command: () => this.setSortBy(''),
    },
  ];

  // Service injections
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.getAllCategories();
    this.getProducts();
  }

  private getProducts(): void {
    const filter = { ...this.filters };
    this.updateLoadingState(false);

    if (filter.category === 'all') {
      delete filter.category;
    }

    this.productsService.getProducts(filter).subscribe({
      next: (response) => {
        this.productCount = response.results;
        this.products = response.data;
        this.filters.page = response.metadata.currentPage;
        this.updateLoadingState(true, 1000);
        this.scrollToTop();
      },
      error: () => {
        this.products = [];
        this.productCount = 0;
        this.updateLoadingState(true, 1500);
        this.scrollToTop();
      },
    });
  }

  private getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  // Unified loading state handler
  private updateLoadingState(done: boolean, delay: number = 0) {
    setTimeout(() => {
      this.dataDone = done;
    }, delay);
  }

  // Filtering actions
  public filterByCategory(categoryId: string, name: string): void {
    this.activeCategoryId = categoryId;
    this.filters.category = categoryId;
    this.categoryName = name;
    this.filters.page = 1;
    this.getProducts();
    this.visible = false;
    this.scrollToTop();
  }

  public filterByBrand(brandId: string): void {
    this.filters.brand = brandId;
    this.filters.page = 1;
    this.getProducts();
  }

  public filterByKeyword(keyword: string): void {
    this.filters.keyword = keyword;
    this.filters.page = 1;
    this.getProducts();
  }

  public filterByPriceRange(min: number, max: number): void {
    this.filters.priceGte = min;
    this.filters.priceLte = max;
    this.filters.page = 1;
    this.getProducts();
  }

  // Pagination
  public onPageChange(event: PaginatorState): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.filters.limit ?? 12;

    this.filters.page = Math.floor(first / rows) + 1;
    this.filters.limit = rows;

    this.getProducts();
    this.scrollToTop();
  }

  // Sorting
  public setSortBy(sortKey: string): void {
    this.filters.sort = sortKey;
    this.filters.page = 1;
    this.getProducts();
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.menu && this.menu.overlayVisible) {
      this.menu.hide();
      (this.menu as any).overlayVisible = false;
    }
  }
}
