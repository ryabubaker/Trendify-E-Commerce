import { Component, inject, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../core/services/orders.service';
import { Orders } from '../../core/models/orders.interface';
import { CookieService } from 'ngx-cookie-service';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
@Component({
  selector: 'app-allorders',
  imports: [FormsModule, BreadcrumbComponent, ProductCardComponent],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css'
})
export class AllordersComponent implements OnInit {

  private readonly ordersService = inject(OrdersService);
  private readonly cookie = inject(CookieService);

  breadcrumbItems:{}[] = [];

  isloading:boolean = true;

  allOrders:Orders[] = [] as Orders[];
  userToken:any;

  value: string = 'off';

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      {label:'Orders'}
    ];

    this.getAllOrders();
  }


  getAllOrders():void {
    this.userToken = jwtDecode(this.cookie.get("token")!);
    console.log(this.userToken.id);
    this.ordersService.getSpacificOrder(this.userToken.id).subscribe({
      next:(res)=>{
        this.isloading = false;
        this.allOrders = res;
        console.log(this.allOrders);
      },
      error:()=>{
        this.isloading = false;   
        console.log("error");
      }

    })  

  }


}