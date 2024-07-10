import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-top-sellers',
  templateUrl: './top-sellers.component.html',
  styleUrls: ['./top-sellers.component.scss']
})
export class TopSellersComponent implements OnInit {
  randomProducts: any[] = [];
  selectedProduct: any = null;
  selectedSize: string = '';
  quantity: number = 1;

  constructor(private dataSrv: DataService, private cartService: CartService) { }

  ngOnInit() {
    this.getRandomProducts();
  }

  getRandomProducts() {
    this.dataSrv.getProducts().subscribe(
      (data: any[]) => {
        this.randomProducts = this.getRandomItems(data, 6);
      },
      error => {
        console.error('Errore durante il recupero dei prodotti', error);
      }
    );
  }

  getRandomItems(array: any[], count: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  openModal(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
    this.selectedSize = '';
    this.quantity = 1;
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
}
