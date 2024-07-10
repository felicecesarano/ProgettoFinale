import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/service/order.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchAllOrders();
  }

  fetchAllOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      () => {
        const orderToUpdate = this.orders.find(order => order.id === orderId);
        if (orderToUpdate) {
          orderToUpdate.status = newStatus;
        }
      },
      (error) => {
        console.error('Error updating order status', error);
      }
    );
  }

  isShipped(status: string): boolean {
    return status === 'Spedito';
  }
}
