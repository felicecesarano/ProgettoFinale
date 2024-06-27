import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartItems: any[] = [];
  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 0) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getTotalItems() {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }

  removeItem(item: any) {
    this.cartService.removeFromCart(item);
    this.cartItems = this.cartService.getCartItems();
  }

  navigateToAccount() {
    if (this.authService.getToken()) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
