import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() products: any[] = []; // Input per ricevere i prodotti

  selectedProduct: any = null;
  selectedSize: string = '';
  quantity: number = 1;

  constructor(private cartService: CartService) {}

  ngOnInit() {}

  addToCart() {
    if (this.selectedProduct && this.selectedSize && this.quantity > 0) {
      const totalPrice = this.selectedProduct.price * this.quantity;
      const itemToAdd = {
        product: this.selectedProduct,
        size: this.selectedSize,
        quantity: this.quantity,
        totalPrice: totalPrice
      };
      this.cartService.addToCart(itemToAdd);
    } else {
      alert('Seleziona prodotto, taglia e quantità valide prima di aggiungere al carrello.');
    }
  }

  openModal(product: any) {
    this.selectedProduct = product;
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');
    }
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
      this.selectedProduct = null;
      this.selectedSize = '';
      this.quantity = 1;
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  isSelectedProduct(product: any): boolean {
    return this.selectedProduct === product;
  }
}
