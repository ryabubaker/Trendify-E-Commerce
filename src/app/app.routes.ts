import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/guards/auth-guard';
import { isLoggedGuard } from './core/guards/is-logged-guard';
import { LandingLayoutComponent } from './core/layouts/landing-layout/landing-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    component: LandingLayoutComponent,
    canActivate: [isLoggedGuard],
    children: [
      {
        path: 'landing',
        loadComponent: () =>
          import('./features/landing/landing.component').then(
            (m) => m.LandingComponent
          ),
        title: 'Landing',
      },
    ],
  },

  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [isLoggedGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
        canActivate: [authGuard],
      },
      {
        path: 'category',
        title: 'Categories',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/categories/categories.component').then(
                (m) => m.CategoriesComponent
              ),
            title: 'All Categories',
          },
          {
            path: ':slug/:id',
            loadComponent: () =>
              import('./features/categories/categories.component').then(
                (m) => m.CategoriesComponent
              ),
            title: 'Category',
          },
        ],
      },
      {
        path: 'details',
        title: 'Details',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./features/details/details.component').then(
                (m) => m.DetailsComponent
              ),
            title: 'Details',
          },
          {
            path: ':slug/:id',
            loadComponent: () =>
              import('./features/details/details.component').then(
                (m) => m.DetailsComponent
              ),
            title: 'Details',
          },
        ],
      },
      {
        path: 'wishlist',
        title: 'Wishlist',
        loadComponent: () =>
          import('./features/wishlist/wishlist.component').then(
            (m) => m.WishlistComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'blog',
        title: 'Blog',
        loadComponent: () =>
          import('./features/blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: 'contact',
        title: 'Contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
      {
        path: 'about',
        title: 'About',
        loadComponent: () =>
          import('./features/about/about.component').then(
            (m) => m.AboutComponent
          ),
      },
      {
        path: 'cart',
        title: 'Cart',
        loadComponent: () =>
          import('./features/cart/cart.component').then((m) => m.CartComponent),
        canActivate: [authGuard],
      },
      {
        path: 'allorders',
        title: 'Orders',
        loadComponent: () =>
          import('./features/allorders/allorders.component').then(
            (m) => m.AllordersComponent
          ),
          canActivate: [authGuard],
      },
      {
        path: 'checkout/:id',
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
        title: 'Checkout',
        canActivate: [authGuard],
      },
    ],
  },
  // 404 fallback
  { path: '**', component: NotfoundComponent, title: 'Not Found' },
];
