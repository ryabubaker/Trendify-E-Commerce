import { Component, inject, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishListService } from '../../core/services/wishlist.service';
import { Wishlist } from '../../core/models/wishlist.interface';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishListService = inject(WishListService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  wishlistCount = this.wishListService.whisListCount;

  breadcrumbItems: {}[] = [];

  product: Wishlist = {} as Wishlist;
  isloading = true;
  loadingId: string | null = null;
  loadingremoveId: string | null = null;

  ngOnInit(): void {
    this.fetchData();
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Wishlist' },
    ];
  }

  fetchData(): void {
    this.isloading = true;
    this.wishListService
      .getLoggedUserWishList()
      .pipe(finalize(() => (this.isloading = false)))
      .subscribe({
        next: (res) => {
          this.product = res ?? ({} as Wishlist);
        },
        error: () => {
          this.product = {} as Wishlist;
          this.toastrService.error('Failed to load wishlist', 'Trendify');
        },
      });
  }

  addToCartFromWishList(id: string): void {
    this.loadingId = id;
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.loadingId = null;
        this.toastrService.success(res.message, 'Trendify');
      },
      error: (err) => {
        this.loadingId = null;
      },
    });
  }

  removeItemFromWishList(id: string): void {
    this.loadingremoveId = id;
    this.wishListService.removeProductFromWishList(id).subscribe({
      next: (res) => {
        console.log(res.count);
        this.wishListService.whisListCount.set(res.data.length);
        this.loadingremoveId = null;

        const remainingIds = res.data as string[];

        this.product.data = this.product.data.filter((prod: any) =>
          remainingIds.includes(prod._id)
        );

        this.toastrService.success(res.message, 'Trendify');
      },
      error: (err) => {
        this.loadingremoveId = null;
      },
    });
  }
}
