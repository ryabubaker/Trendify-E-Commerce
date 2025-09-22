import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { NotfoundComponent } from './features/notfound/notfound.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
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
      },
      {
        path: 'products',
        title: 'Products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/categories/categories.component').then(
                (m) => m.CategoriesComponent
              ),
          },
          {
            path: 'details/:slug/:id',
            loadComponent: () =>
              import('./features/details/details.component').then(
                (m) => m.DetailsComponent
              ),
            title: 'Details',
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import('./features/details/details.component').then(
                (m) => m.DetailsComponent
              ),
            title: 'Details',
          },
        ],
      },

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
  // 404 fallback
  { path: '**', component: NotfoundComponent, title: 'Not Found' },
];
