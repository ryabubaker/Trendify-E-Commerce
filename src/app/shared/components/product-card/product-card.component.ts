import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../../../core/services/cart.service';

import { ToastrService } from 'ngx-toastr';
import { WishListService } from '../../../core/services/wishlist.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, SkeletonModule, NgClass],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);
  private readonly toastrService = inject(ToastrService);

  @Input() product: Product = {} as Product;
  @Input() loading = false;
  @Input() inWishList: boolean = false;
  @Output() ShowData = new EventEmitter<void>();
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

  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.ShowData.emit();
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'Trendify');
        }
      },
      error: (err) => {},
    });
  }

  removeItemFromWishList(id: string): void {
    this.wishListService.removeProductFromWishList(id).subscribe({
      next: (res) => {
        this.inWishList = !this.inWishList;
        this.toastrService.success(res.message, 'Trendify');
        this.wishListService.whisListCount.set(res.data.length);
      },
    });
  }

  addToWishList(id: string): void {
    const prev = this.inWishList;
    this.inWishList = !prev; // optimistic UI

    const req = this.inWishList
      ? this.wishListService.addProductToWishList(id)
      : this.wishListService.removeProductFromWishList(id);

    req.subscribe({
      next: (res) => {
        this.toastrService.success(res.message, 'Trendify');
        this.wishListService.whisListCount.set(res.data.length);
      },
      error: () => {
        this.inWishList = prev; // rollback on error
      },
    });
  }
}
