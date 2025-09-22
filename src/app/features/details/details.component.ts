import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MenuItem } from 'primeng/api';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products/products.service';
import { url } from 'inspector';

@Component({
  selector: 'app-details',
  imports: [BreadcrumbComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  dataDone: boolean = false;
  basePrice: number = 0;
  productPrice: number = 0;
  productId: string = '';
  productDetails: Product = {} as Product;

  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.getProductId();
  }

  getProductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (res: any) => {        
        this.productId = res.params.id;
        this.loadProductDetails(this.productId);
      },
    });
  }

  loadProductDetails(id: string) {
    this.dataDone = false;
    this.productsService.getDetailsOfProduct(id).subscribe({
      next: (res) => {
        this.dataDone = true;
        this.productDetails = res.data;
        this.basePrice = this.productDetails.price;
        this.productPrice = this.basePrice;

        // this.loadSimilarProducts();
        this.buildBreadcrumb();
        // this.loadWishlist();
      },
      error: () => {
        this.dataDone = true;
      },
    });
  }

  buildBreadcrumb() {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Category', routerLink: '/products/' },
      { label: this.productDetails.category.name },
    ];
  }
}
