import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { Category } from '../../../../core/models/category.interface';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-categories-slider',
  imports: [CarouselModule],

  templateUrl: './categories-slider.component.html',
  styleUrl: './categories-slider.component.css',
})
export class CategoriesSliderComponent implements OnInit, AfterViewInit {
  private readonly categoriesService = inject(CategoriesService);

  @ViewChild('categoriesCarousel') categoriesCarousel!: CarouselComponent;

  constructor() {
    window.addEventListener('resize', () => {
      this.reinitializeOwlCarousel();
    }, {passive:true});
    window.addEventListener('load', () => {
      this.reinitializeOwlCarousel();
    },{passive:true});
  }

  ngAfterViewInit() {
    this.reinitializeOwlCarousel();
  }

  reinitializeOwlCarousel(): void {
    this.categoriesCarousel.ngOnInit();
    this.categoriesCarousel.ngAfterContentInit();
  }

  categoriesList: Category[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  getAllCategoriesData(): void {
    this.loading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList = res.data.map(
          (cat:any) => ({ ...cat, loaded: false } as Category & { loaded: boolean })
        );
        setTimeout(() => {
          this.loading = false;
        }, 1000); 
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  // Carousel configuration
  customOptions: OwlOptions = {
    loop: true,
    margin:0,
    nav: false,
    dots: true,
    autoplay: false,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 3 },
      768: { items: 4 },
      1024: { items: 8 },
    },
  };

  prevSlide() {
    this.categoriesCarousel.prev();
  }

  nextSlide() {
    this.categoriesCarousel.next();
  }
}
