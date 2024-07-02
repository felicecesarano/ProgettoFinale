import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `http://localhost:8080/api`; 

  constructor(private http: HttpClient) { }

  saveOrder(order: Order): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save-order`, order);
  }


}
