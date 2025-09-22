import { Component, Input, OnInit } from '@angular/core';

import { Breadcrumb } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-breadcrumb',
  imports: [Breadcrumb, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {

  @Input() items: MenuItem[] = [];
}
