import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink, RouterLinkActive, Menubar],
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        routerLink: '/home',
        routerLinkActiveOptions: { exact: true },
        styleClass: 'text-sm text-text-2 hover:text-main transition',
      },
      {
        label: 'Services',
        routerLink: '/services',
        styleClass: 'text-sm text-text-2 hover:text-main transition',
      },
      {
        label: 'Products',
        routerLink: '/products',
        styleClass: 'text-sm text-text-2 hover:text-main transition',
      },
      {
        label: 'About Us',
        routerLink: '/about',
        styleClass: 'text-sm text-text-2 hover:text-main transition',
      },
      {
        label: 'Contact Us',
        routerLink: '/contact',
        styleClass: 'text-sm text-text-2 hover:text-main transition',
      },
    ];
  }
}
