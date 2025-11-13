import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-contact',
  imports: [BreadcrumbComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

breadcrumbItems: MenuItem[]=[];

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Contact' },
    ];
  }

}
