import { Component, ViewChild } from '@angular/core';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonial',
  imports: [CarouselModule],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.css',
})
export class TestimonialComponent {
  @ViewChild('testimonialCarousel') testimonialCarousel!: CarouselComponent;

  testimonial = [
    {
      name: 'Berry Gunawan',
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati quasi eos aliquam similique nesciunt magnam dolorem repudiandae a quo doloremque!',
      rating: '3.5',
    },
    {
      name: 'Berry Gunawan',
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati quasi eos aliquam similique nesciunt magnam dolorem repudiandae a quo doloremque!',
      rating: '3.5',
    },
    {
      name: 'Berry Gunawan',
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati quasi eos aliquam similique nesciunt magnam dolorem repudiandae a quo doloremque!',
      rating: '3.5',
    },
  ];
  // Carousel configuration
  customOptions: OwlOptions = {
    loop: false,
    margin: 16,
    nav: false,
    dots: true,
    autoplay: false,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
      768: { items: 3 },
    },
  };

  prevSlide() {
    this.testimonialCarousel.prev();
  }

  nextSlide() {
    this.testimonialCarousel.next();
  }
}
