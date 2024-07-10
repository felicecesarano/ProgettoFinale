import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `http://localhost:8080/api`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/place-order`, orderData);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  getOrdersForCurrentUser(): Observable<Order[]> {
    const userId = this.authService.getUserId(); // Ottieni l'ID dell'utente corrente
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user/${userId}`);
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${orderId}/status`, newStatus);
  }
}
