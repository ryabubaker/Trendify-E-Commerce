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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-slider',
  imports: [CarouselModule, RouterLink],
  templateUrl: './categories-slider.component.html',
  styleUrl: './categories-slider.component.css',
})
export class CategoriesSliderComponent implements OnInit, AfterViewInit {
  private readonly categoriesService = inject(CategoriesService);

  @ViewChild('categoriesCarousel') categoriesCarousel!: CarouselComponent;

  categoriesList: (Category & { loaded: boolean })[] = [];
  loading = true;

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  ngAfterViewInit(): void {
    // Reinitialize after view init (safe timing)
    this.reinitializeOwlCarousel();

    window.addEventListener('resize', () => this.reinitializeOwlCarousel(), {
      passive: true,
    });
  }

  private reinitializeOwlCarousel(): void {
    if (this.categoriesCarousel) {
      this.categoriesCarousel.ngOnInit();
      this.categoriesCarousel.ngAfterContentInit();
    }
  }

  private getAllCategoriesData(): void {
    this.loading = true;

    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList = res.data.map(
          (cat) => ({ ...cat, loaded: false })
        );

        setTimeout(() => (this.loading = false), 400);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // Carousel configuration
  customOptions: OwlOptions = {
    loop: true,
    margin: 0,
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

  prevSlide(): void {
    this.categoriesCarousel?.prev();
  }

  nextSlide(): void {
    this.categoriesCarousel?.next();
  }
}
