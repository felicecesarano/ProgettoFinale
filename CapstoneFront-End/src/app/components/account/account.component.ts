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
  showAllUsers: boolean = false; // Inizializza showAllUsers a false

  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Controlla se l'utente è Admin
    const user = this.authService.getUser();
    this.isAdmin = user && user.role === 'Admin';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Metodo per impostare la vista desiderata e resettare le altre
  setActiveView(view: string): void {
    // Resetta tutti i flag a false
    this.showOrders = false;
    this.showAddProduct = false;
    this.showAllProducts = false;
    this.showAllUsers = false;

    // Imposta il flag della vista desiderata a true
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
      default:
        break;
    }
  }
}
