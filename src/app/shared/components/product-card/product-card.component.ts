import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, SkeletonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: Product = {} as Product;
  @Input() loading = false;
  imageLoading: boolean = true;

  calculateDiscount(originalPrice?: number, discountedPrice?: number): number {
    if (originalPrice == null || discountedPrice == null) {
      return 0;
    }
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  }

  onImageLoad() {
    this.imageLoading = false;
  }
}
