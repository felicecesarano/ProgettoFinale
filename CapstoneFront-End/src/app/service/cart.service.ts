import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartItems();
  }

  private loadCartItems() {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItemsSubject.next(JSON.parse(storedCartItems));
    }
  }

  private updateCartItems(cartItems: any[]) {
    this.cartItemsSubject.next(cartItems);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  getCartItems(): any[] {
    return this.cartItemsSubject.getValue();
  }

  addToCart(item: any) {
    const currentCartItems = this.getCartItems();
    const updatedCartItems = [...currentCartItems, item];
    this.updateCartItems(updatedCartItems);
  }

  removeFromCart(item: any) {
    const currentCartItems = this.getCartItems();
    const updatedCartItems = currentCartItems.filter(cartItem => cartItem !== item);
    this.updateCartItems(updatedCartItems);
  }

  clearCart() {
    this.updateCartItems([]);
  }
}