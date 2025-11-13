import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-about',
  imports: [BreadcrumbComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
breadcrumbItems: MenuItem[]=[];

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'About' },
    ];
  }
}
