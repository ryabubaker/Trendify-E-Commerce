import {
  Component,
  ViewEncapsulation,
  inject,
  HostListener,
  OnInit,
  computed,
  signal,
  Signal,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../../core/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../../core/services/cart.service';
import { WishListService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,

    Menu,
    ToastModule,
    Dialog,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // deps
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly auth = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);
  private readonly cookie = inject(CookieService);

  // --- state
  menuOpen = signal(false);
  scrolled = signal(false);
  desktop = signal(true);
  currentUrl = signal(this.router.url);
  countCart = this.cartService.cartNumber;
  wishlistCount = this.wishListService.whisListCount;      

  isAuthenticated = this.auth.isAuthenticated;
  isBrowser = isPlatformBrowser(this.platformId);

  isTransparentNav = computed(
    () => this.currentUrl() === '/home' && !this.scrolled()
  );

  toneClass = computed(() => {
    const onHome = this.currentUrl() === '/home';
    if (onHome) {
      return this.scrolled() ? 'text-[rgb(157,157,170)]' : 'text-bg-main';
    }
    return 'text-[rgb(157,157,170)]';
  });

  navClasses = computed(() => ({
    'bg-transparent': this.isTransparentNav(),
    '!bg-bg-main': !this.isTransparentNav(),
    'shadow-md': true,
    'transition-all': true,
    'duration-300': true,
    'ease-in-out': true,
  }));

  // menus
  itemsHome: MenuItem[] = [];
  itemsLanding: MenuItem[] = [];

  // dialog state
  visible = false;
  isPasswordVisibleOld = false;
  isPasswordVisibleNew = false;
  isPasswordVisibleConfirm = false;

  confirmPassword: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const repassword = group.get('rePassword')?.value;
    return password && repassword && password === repassword
      ? null
      : { mismatch: true };
  };

  changePassword = new FormGroup(
    {
      currentPassword: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      password: new FormControl<string | null>(null, [
        Validators.required,
        Validators.pattern(/^[A-Z]\w{7,}$/),
      ]),
      rePassword: new FormControl<string | null>(null, [
        Validators.required,
        Validators.pattern(/^[A-Z]\w{7,}$/),
      ]),
    },
    { validators: [this.confirmPassword] }
  );

  ngOnInit(): void {
    // ensure we reflect cookie->signal on hard refresh
    this.auth.saveUserData();

    // keep currentUrl in sync
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.currentUrl.set(e.urlAfterRedirects || e.url));

    // SSR-safe screen width observer
    if (isPlatformBrowser(this.platformId)) {
      const mq = window.matchMedia('(min-width: 768px)');
      const update = () => this.desktop.set(mq.matches);
      update();
      mq.addEventListener?.('change', update);
    }

    const name = this.cookie.get('InfoUser') || 'Account';
    this.itemsHome = [
      {
        label: name,
        items: [
          {
            label: 'Orders',
            icon: 'fa-solid fa-box text-text',
            command: () => this.router.navigate(['/allorders']),
          },
          {
            label: 'Change Password',
            icon: 'fa-solid fa-key text-text',
            command: () => (this.visible = true),
          },
          {
            label: 'Logout',
            icon: 'fa-solid fa-right-from-bracket text-text',
            command: () => this.auth.logout(),
          },
        ],
      },
    ];

    this.itemsLanding = [
      {
        label: 'Auth',
        items: [
          {
            label: 'Login',
            icon: 'fa-solid fa-right-from-bracket',
            routerLink: '/login',
          },
          {
            label: 'SignUp',
            icon: 'fa-solid fa-right-from-bracket',
            routerLink: '/register',
          },
        ],
      },
    ];

    if (this.isBrowser) {
    this.cartService.refreshCartCount();
    this.wishListService.refreshWishlistCount();
  }

  }

  // scroll -> only toggles a signal
  @HostListener('window:scroll')
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 80);
    }
  }

  // UI helpers
  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }
  closeMenuOnMobileNavigate() {
    if (!this.desktop()) this.menuOpen.set(false);
  }
  showDialog() {
    this.visible = true;
  }

  togglePasswordVisibility(kind: 'current' | 'new' | 'confirm') {
    if (kind === 'current')
      this.isPasswordVisibleOld = !this.isPasswordVisibleOld;
    else if (kind === 'new')
      this.isPasswordVisibleNew = !this.isPasswordVisibleNew;
    else this.isPasswordVisibleConfirm = !this.isPasswordVisibleConfirm;
  }

  ResetPassword(): void {
    if (this.changePassword.invalid) return;
    this.auth.changePassword(this.changePassword.value as any).subscribe({
      next: () => {
        this.visible = false;
      },
      error: () => {
        /* TODO: toast error */
      },
    });
  }

  navHomeLink() {
    return this.isAuthenticated() ? '/home' : '/landing';
  }
}
