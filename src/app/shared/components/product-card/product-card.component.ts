import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product: Product = {} as Product;

  calculateDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  }
}
