import { ActivatedRoute } from '@angular/router';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MenuItem } from 'primeng/api';
import { Product } from '../../core/models/product.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { Skeleton } from 'primeng/skeleton';
import { SwiperContainer } from 'swiper/element';
import { AccordionModule } from 'primeng/accordion';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { NgClass } from '@angular/common';
import { WishListService } from '../../core/services/wishlist.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-details',
  imports: [
    BreadcrumbComponent,
    Skeleton,
    AccordionModule,
    ProductCardComponent,
    NgClass,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  @ViewChild('verticalSwiper') verticalSwiper!: SwiperContainer;
  @ViewChild('horizontalSwiper') horizontalSwiper!: SwiperContainer;

  breadcrumbItems: MenuItem[] = [];
  dataDone: boolean = false;
  basePrice: number = 0;
  productPrice: number = 0;
  productId: string = '';
  productDetails: Product = {} as Product;

  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);
  private readonly toastrService = inject(ToastrService);

  theSameProductsCategory: [] = [];
  similarProducts: Product[] = [];
  loading: boolean = false;
  AddToCartSuccess: boolean = false;
  itemsMenuDetils: MenuItem[] = [];
  quantity: number = 1;
  inWishList: any;

  isMobile = window.innerWidth < 768;
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

        this.buildBreadcrumb();
        this.getSimilarProduct();
        // this.loadWishlist();
      },
      error: () => {
        this.dataDone = true;
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
    this.productsService.getProducts({ page: 1 }).subscribe({
      next: (res) => {
        console.log(res.data);

        this.theSameProductsCategory = res.data.filter(
          (prod: any) =>
            prod.category.name === this.productDetails.category.name &&
            prod.id !== this.productDetails.id
        );

        console.log(this.theSameProductsCategory);

        this.similarProducts = this.getRandomProducts(
          this.theSameProductsCategory,
          4
        );

        console.log(this.similarProducts);

        this.dataDone = true;
      },
    });
  }

  buildBreadcrumb() {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Category', routerLink: '/category/' },
      {
        label: this.productDetails.category.name,
        routerLink:
          '/category/' +
          this.productDetails.category.slug +
          '/' +
          this.productDetails.category._id,
      },
    ];
  }

  increaseQuantity() {
    this.quantity++;
    this.productPrice = this.quantity * this.basePrice;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.productPrice = this.quantity * this.basePrice;
    }
  }

  addToWishList(id: string): void {
    if (!this.inWishList) {
      this.wishListService.addProductToWishList(id).subscribe({
        next: (res) => {
          console.log(res.data.length);
          this.inWishList = !this.inWishList;
          this.toastrService.success(res.message, 'Trendify');
          this.wishListService.whisListCount.set(res.data.length);
        },
      });
    } else {
      this.removeItemFromWishList(id);
    }
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

  addToCart(id: string): void {
    this.loading = true;

    const requests = Array.from({ length: this.quantity }, () =>
      this.cartService.addProductToCart(id)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        this.loading = false;

        const lastRes = results[results.length - 1];

        if (lastRes?.status === 'success') {
          this.toastrService.success(lastRes.message, 'Trendify');
        }
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  categorySlider(direction: 'prev' | 'next') {
    const swiper =
      window.innerWidth < 768
        ? this.horizontalSwiper.swiper
        : this.verticalSwiper.swiper;

    if (direction === 'prev') {
      swiper.slidePrev();
    } else {
      swiper.slideNext();
    }
  }

  changeCoverImage(smallImage: string): void {
    this.productDetails.imageCover = smallImage;
  }
}
