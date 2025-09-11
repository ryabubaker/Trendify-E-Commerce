import { Component, inject } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../../../core/services/products/products.service';
import { Observable } from 'rxjs';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-top-products',
  imports: [ProductCardComponent],
  templateUrl: './top-products.component.html',
  styleUrl: './top-products.component.css',
})
export class TopProductsComponent {
  private readonly productsService = inject(ProductsService);
  topSelling: Product[] = [];

  ngOnInit(): void {
    this.getTopSellingProducts();
  }

  getTopSellingProducts(): void {
    this.productsService.getProducts({ sort: '-sold', limit: 8 }).subscribe({
      next: (response) => {
        this.topSelling = response.data;
      },
      error: (error) => {
        console.error('Error fetching top selling products:', error);
      },
    });
  }
}
