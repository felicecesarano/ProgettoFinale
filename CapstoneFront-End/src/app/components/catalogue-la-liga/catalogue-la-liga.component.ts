import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { CartService } from 'src/app/service/cart.service';
@Component({
  selector: 'app-catalogue-la-liga',
  templateUrl: './catalogue-la-liga.component.html',
  styleUrls: ['./catalogue-la-liga.component.scss']
})
export class CatalogueLaLigaComponent implements OnInit{
  products: any[] = [];
  selectedProduct: any = null; // per memorizzare il prodotto selezionato
  selectedSize: string = ''; // per memorizzare la taglia selezionata
  quantity: number = 1; // per memorizzare la quantità selezionata

  constructor(
    private dataSrv: DataService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.dataSrv.getProducts().subscribe(
      (data: any[]) => {
        // Filtra i prodotti per la categoria "SerieA"
        this.products = data.filter(product => product.category === 'SerieA');
      },
      error => {
        console.error('Errore durante il recupero dei prodotti', error);
      }
    );
  }

  openModal(product: any) {
    this.selectedProduct = product; // Imposta il prodotto selezionato
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
      this.selectedProduct = null; // Resetta il prodotto selezionato quando si chiude la modale
      this.selectedSize = ''; // Resetta la taglia selezionata
      this.quantity = 1; // Resetta la quantità selezionata
    }
  }

  addToCart() {
    if (this.selectedProduct && this.selectedSize && this.quantity > 0) {
      // Calcola il prezzo totale
      const totalPrice = this.selectedProduct.price * this.quantity;

      // Aggiungi al carrello utilizzando il servizio CartService
      const itemToAdd = {
        product: this.selectedProduct,
        size: this.selectedSize,
        quantity: this.quantity,
        totalPrice: totalPrice
      };
      this.cartService.addToCart(itemToAdd);

      // Chiudi la modale dopo l'aggiunta al carrello
      this.closeModal();
    } else {
      alert('Seleziona taglia e quantità valide prima di aggiungere al carrello.');
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }
}
