import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environments.stripe';
import { Stripe, loadStripe } from '@stripe/stripe-js'; // Importa Stripe e loadStripe da @stripe/stripe-js

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartItems: any[] = [];
  scrolled: boolean = false;
  stripePromise: Promise<Stripe | null>;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    // Inizializza la Promise per Stripe utilizzando loadStripe
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

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

  async checkout(): Promise<void> {
    const stripe = await this.stripePromise;
  
    if (!stripe) {
      console.error('Stripe.js non è stato correttamente inizializzato.');
      return;
    }
  
    // Calcola l'importo totale dal carrello
    const totalAmount = this.getTotalPrice(); // Assumendo che getTotalPrice() restituisca l'importo in euro
  
    try {
      const response = await this.http.post<any>('http://localhost:8080/api/create-checkout-session', {
        amount: totalAmount,  // Invia l'importo direttamente in euro
        currency: 'EUR'  // Specifica la valuta, es. EUR per euro
        // Altri dati del pagamento necessari per il tuo backend o per Stripe
      }).toPromise();
  
      // Apri Stripe Checkout con la sessione creata dal backend
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId
      });
  
      if (error) {
        console.error('Errore durante il checkout:', error.message);
      }
    } catch (error) {
      console.error('Errore durante la richiesta al backend:', error);
    }
  }
}