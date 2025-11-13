import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private httpClient:HttpClient) { }



  // getAllOrders():Observable<any> 
  // {
  //   return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/orders/`);
  // }


  getSpacificOrder(userId:string):Observable<any> 
  {
    return this.httpClient.get(`${environment.baseUrl}orders/user/${userId}`)
  }



}