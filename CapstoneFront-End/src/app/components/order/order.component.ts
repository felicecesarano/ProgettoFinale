import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/service/order.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchUserOrders();
  }

  fetchUserOrders(): void {
    this.orderService.getOrdersForCurrentUser().subscribe(
      (data: Order[]) => {
        this.orders = data;
        console.log('Orders:', this.orders); // Log degli ordini ricevuti
      },
      (error) => {
        console.error('Error fetching user orders', error);
      }
    );
  }
}
