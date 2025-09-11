import { Component } from '@angular/core';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { FlashSaleComponent } from './components/flash-sale/flash-sale.component';
import { CategoriesSliderComponent } from './components/categories-slider/categories-slider.component';
import { AdsSectionComponent } from './components/ads-section/ads-section.component';
import { NewCollectionComponent } from './components/new-collection/new-collection.component';
import { HomeServicesComponent } from "./components/home-services/home-services.component";
import { TopProductsComponent } from "./components/top-products/top-products.component";
import { BestSellingComponent } from "./components/best-selling/best-selling.component";
import { TestimonialComponent } from "./components/testimonial/testimonial.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    HomeHeroComponent,
    FlashSaleComponent,
    CategoriesSliderComponent,
    AdsSectionComponent,
    NewCollectionComponent,
    HomeServicesComponent,
    TopProductsComponent,
    BestSellingComponent,
    TestimonialComponent
],
})
export class HomeComponent {}
