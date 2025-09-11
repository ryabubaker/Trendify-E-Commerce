import { Component, ViewChild } from '@angular/core';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-ads-section',
  imports: [CarouselModule],
  templateUrl: './ads-section.component.html',
  styleUrl: './ads-section.component.css',
})
export class AdsSectionComponent {
  @ViewChild('adsCarousel') adsCarousel!: CarouselComponent;

  imgs = ['/images/home/ads/ad-1.jpg', '/images/home/ads/ad-2.png'];

  adsOptions: OwlOptions = {
    loop: true,
    margin: 20,
    nav: false,
    dots: true,
    autoplay: false,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
    },
  };

  prevSlide() {
    this.adsCarousel.prev();
  }

  nextSlide() {
    this.adsCarousel.next();
  }
}
