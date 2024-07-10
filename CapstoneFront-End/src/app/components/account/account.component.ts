import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  showOrders: boolean = true;
  showAddProduct: boolean = false;
  showAllProducts: boolean = false;
  showAllUsers: boolean = false;
  showAllOrders: boolean = false;

  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {

    const user = this.authService.getUser();
    this.isAdmin = user && user.role === 'Admin';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  setActiveView(view: string): void {

    this.showOrders = false;
    this.showAddProduct = false;
    this.showAllProducts = false;
    this.showAllUsers = false;
    this.showAllOrders = false;


    switch (view) {
      case 'orders':
        this.showOrders = true;
        break;
      case 'addProduct':
        this.showAddProduct = true;
        break;
      case 'allProducts':
        this.showAllProducts = true;
        break;
      case 'allUsers':
        this.showAllUsers = true;
        break;
      case 'allOrders':
        this.showAllOrders = true;
        break;
      default:
        break;
    }
  }
}
