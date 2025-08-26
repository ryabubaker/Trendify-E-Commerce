import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductsService } from '../../core/services/products/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [ProductCardComponent],
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productList: Product[] = [];

  ngOnInit(): void {
    this.getAllProductsData();
    console.log(this.discountedProducts)
  }

  getAllProductsData(): void {
    this.productsService.getAllProducts().subscribe({
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
