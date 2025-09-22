import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../../../core/services/products/products.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-flash-sale',
  imports: [ProductCardComponent],
  templateUrl: './flash-sale.component.html',
  styleUrl: './flash-sale.component.css',
})
export class FlashSaleComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productList: Product[] = [];

  ngOnInit(): void {
    this.getAllProductsData();
  }

  getAllProductsData(): void {
    this.productsService.getProducts().subscribe({
      next: (response) => {
        this.productList = response.data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  get discountedProducts() {
    return this.productList
      .filter((p) => (p.priceAfterDiscount ?? 0) > 0)
      .slice(0, 4);
  }
}
