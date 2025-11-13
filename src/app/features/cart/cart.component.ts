import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { Cart } from '../../core/models/cart.interface';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CartCardComponent } from '../../shared/components/cart-card/cart-card.component';
import { Product } from '../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [
    BreadcrumbComponent,
    ProductCardComponent,
    CartCardComponent,
    RouterLink,
    NgClass
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly productsService = inject(ProductsService);

  cartCount = this.cartService.cartNumber;

  similarProduct: Product[] = [];

  isloading: boolean = true;

  cartProduct: Cart = {} as Cart;

  dataDone: boolean = false;

  NoItemInCart: boolean = false;

  loadingOfIcons: boolean = false;
  valueOfMoneyMethod = 'Free';

  breadcrumbItems: {}[] = [];

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Cart' },
    ];
    this.getLoggedUserCart();
    this.getSimilarProduct();
  }

  getLoggedUserCart(): void {
  this.cartService.getLoggedUserCart().subscribe({
    next: (res) => {
      this.cartProduct = res;
      this.isloading = false;
      this.cartService.CartPrice = this.cartProduct.data.totalCartPrice;
    },
  });
}

  getRandomProducts(
    products: any[],
    count: number,
    exclude: any[] = []
  ): any[] {
    const filteredProducts = products.filter((prod) => !exclude.includes(prod));

    const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getSimilarProduct() {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.similarProduct = res.data;

        this.similarProduct = this.getRandomProducts(this.similarProduct, 4);
        console.log(this.similarProduct);
        this.dataDone = true;
      },
      error: () => {
        this.dataDone = true;
      },
    });
  }

  onItemRemoved(id: string) {
    this.cartProduct.data.products = this.cartProduct.data.products.filter(
      (prod) => prod.product.id !== id
    );
  }

  onCountUpdated(event: { id: string; count: number }) {
    const product = this.cartProduct.data.products.find(
      (prod) => prod.product.id === event.id
    );
    if (product) {
      product.count = event.count;
    }
    console.log('Count updated locally:', event);
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        if (res.message == 'success') {
          this.cartService.cartNumber.set(0);
          this.cartProduct = {} as Cart;
          this.NoItemInCart = true;
        }
      },
    });
  }

  productWhenAddProductInCart() {
    this.getLoggedUserCart();
  }

  get cartTotal(): number {
    const prods = this.cartProduct?.data?.products ?? [];
    return prods.reduce(
      (sum, p) => sum + Number(p.count || 0) * Number(p.price || 0),
      0
    );
  }

  get discountedTotal(): number {
    return this.cartTotal - this.cartTotal * 0.2; // 20% discount
  }

  get hasItems(): boolean {
    return (this.cartProduct?.data?.products?.length ?? 0) > 0;
  }

  

}
