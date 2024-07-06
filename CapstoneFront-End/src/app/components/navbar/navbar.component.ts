import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environments.stripe';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { Product } from 'src/app/models/product';
import { DataService } from 'src/app/service/data.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartItems: any[] = [];
  scrolled: boolean = false;
  stripePromise: Promise<Stripe | null>;
  searchTerm: string = '';
  searchResults: Product[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private dataSrv: DataService,
    private orderSrv: OrderService,
  ) {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getTotalItems(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
}


  removeItem(item: any): void {
    this.cartService.removeFromCart(item);
    this.cartItems = this.cartService.getCartItems();
  }

  navigateToAccount(): void {
    if (this.authService.getToken()) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async checkout(): Promise<void> {
    if (!this.authService.getToken()) {
      alert('Devi essere loggato per procedere con il checkout.');
      this.router.navigate(['/login']);
      return;
    }
  
    if (this.cartItems.length === 0) {
      alert('Il carrello è vuoto.');
      return;
    }
  
    const stripe = await this.stripePromise;
  
    if (!stripe) {
      console.error('Stripe.js non è stato correttamente inizializzato.');
      return;
    }
  
    const customerId = this.authService.getUserId();
    const paymentDtos = this.cartItems.map(item => ({
      amount: item.product.price,
      customerId: customerId,
      productId: item.product.id,
      size: item.size,
      quantity: item.quantity,
  }));
  
  console.log('Dati inviati al backend:', paymentDtos);
  
    try {
      const response = await this.http.post<any>('http://localhost:8080/api/create-checkout-session', paymentDtos).toPromise();
  
      const { error, sessionId } = response;
  
      if (error) {
        console.error('Errore durante la creazione della sessione di checkout:', error.message);
        return;
      }
  
      const stripeResult = await stripe.redirectToCheckout({
        sessionId: sessionId
      });
  
      if (stripeResult.error) {
        console.error('Errore durante il checkout:', stripeResult.error.message);
      } else {
        this.placeOrder(paymentDtos);
      }
    } catch (error) {
      console.error('Errore durante la richiesta al backend:', error);
    }
  }
  


  async placeOrder(paymentDtos: any[]): Promise<void> {
    try {
      console.log('Invio ordine al backend:', paymentDtos); 
      const response = await this.orderSrv.placeOrder(paymentDtos).toPromise();
      console.log('Ordine creato con successo:', response);
    } catch (error) {
      console.error('Errore durante la salvataggio dell\'ordine:', error);
    }
  }
  


  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value.trim();

    if (this.searchTerm.length >= 1) {
      this.searchProducts();
    } else {
      this.searchResults = [];
    }
  }

  searchProducts(): void {
    this.dataSrv.searchProductsByName(this.searchTerm).subscribe(
      (results: Product[]) => {
        this.searchResults = results;
      },
      (error) => {
        console.error('Errore nella ricerca:', error);
      }
    );
  }

  getProductRoute(category: string): any[] {
    switch (category) {
      case 'SerieA':
        return ['/serie-a'];
      case 'PremierLeague':
        return ['/premierleague'];
      case 'Ligue1':
        return ['/ligue1'];
      case 'LaLiga':
        return ['/laliga'];
      case 'Bundesliga':
        return ['/bundesliga'];
      default:
        return ['/'];
    }
  }

  increaseQuantity(item: any): void {
    item.quantity++;
    item.totalPrice += item.product.price; 
    this.cartService.updateCartItems(this.cartItems);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice -= item.product.price; 
      this.cartService.updateCartItems(this.cartItems);
    }
  }
}
