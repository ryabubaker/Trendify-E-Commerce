import {
  Component,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CategoriesService } from '../../core/services/categories/categories.service';
import {
  ProductFilter,
  ProductsService,
} from '../../core/services/products/products.service';
import { Product } from '../../core/models/product.interface';
import { Category } from '../../core/models/category.interface';

// PrimeNG Imports
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { WishListService } from '../../core/services/wishlist.service';

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
  readonly wishListService = inject(WishListService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  breadcrumbItems:MenuItem[]=[];

  ngOnInit(): void {
       this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Category'},
    ];
    this.getAllCategories();
    this.wishListService.fetchWishListItems();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const slugFromUrl = params.get('slug');

      if (id) {
        this.loadCategoryById(id, slugFromUrl ?? undefined);
      } else {
        this.resetFilters();
        this.getProducts();
      }
    });
  }

  private loadCategoryById(id: string, slugFromUrl?: string) {
    this.categoriesService.getCategoryById(id).subscribe({
      next: (res) => {
        const category = res.data;
        if (!category) {
          this.resetFilters();
          this.getProducts();
          return;
        }

        const canonicalSlug = category.slug;

        // Redirect to canonical URL if slug mismatch
        if (slugFromUrl !== canonicalSlug) {
          this.router.navigate(['/category', canonicalSlug, id], {
            replaceUrl: true,
          });
          return;
        }

        // Apply filters
        this.activeCategoryId = id;
        this.filters.category = id;
        this.categoryName = category.name;
        this.filters.page = 1;

        this.getProducts();
      },
      error: () => {
        this.resetFilters();
        this.getProducts();
      },
    });
  }

  private resetFilters() {
    this.filters = { page: 1, limit: this.pageSize, sort: '', category: 'all' };
    this.activeCategoryId = 'all';
    this.categoryName = 'All Products';
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
        this.categories = [
          {
            _id: 'all',
            name: 'All Products',
            slug: 'all',
            image: '',
            createdAt: '',
            updatedAt: '',
          },
          ...response.data,
        ];
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

  public onCategoryClick(category: Category): void {
    this.router.navigate(['/category', category.slug, category._id]);
  }

  public onAllProductsClick(): void {
    this.resetFilters();
    this.getProducts();
    this.categoryName = 'All Products';
    this.activeCategoryId = 'all';
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
