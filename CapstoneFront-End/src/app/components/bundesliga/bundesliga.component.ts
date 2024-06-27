import { Component, OnInit,HostListener } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { CartService } from 'src/app/service/cart.service';
@Component({
  selector: 'app-bundesliga',
  templateUrl: './bundesliga.component.html',
  styleUrls: ['./bundesliga.component.scss']
})
export class BundesligaComponent implements OnInit{
  randomProducts: any[] = [];
  selectedProduct: any = null;
  selectedSize: string = '';
  quantity: number = 1;
  screenWidth: number = window.innerWidth; // Inizializza la larghezza della finestra

  constructor(private dataSrv: DataService, private cartService: CartService) { }

  ngOnInit() {
    this.getRandomSerieAProducts();
  }

  getRandomSerieAProducts() {
    this.dataSrv.getProducts().subscribe(
      (data: any[]) => {
        const serieAProducts = data.filter(product => product.category === 'SerieA');
        this.randomProducts = this.getRandomItems(serieAProducts, 5);
      },
      error => {
        console.error('Errore durante il recupero dei prodotti SerieA', error);
      }
    );
  }

  getRandomItems(array: any[], count: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.selectedSize = '';
    this.quantity = 1;
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  isLargeScreen(): boolean {
    return this.screenWidth > 992;
  }

  isMediumScreen(): boolean {
    return this.screenWidth <= 992 && this.screenWidth > 768;
  }

  isSmallScreen(): boolean {
    return this.screenWidth <= 768 && this.screenWidth > 576;
  }

  isExtraSmallScreen(): boolean {
    return this.screenWidth <= 576;
  }
}
