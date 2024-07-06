import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { CartService } from 'src/app/service/cart.service';
@Component({
  selector: 'app-catalogue-bundesliga',
  templateUrl: './catalogue-bundesliga.component.html',
  styleUrls: ['./catalogue-bundesliga.component.scss']
})
export class CatalogueBundesligaComponent implements OnInit{
  products: any[] = [];
  selectedProduct: any = null; 
  selectedSize: string = ''; 
  quantity: number = 1; 

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
        
        this.products = data.filter(product => product.category === 'Bundesliga');
      },
      error => {
        console.error('Errore durante il recupero dei prodotti', error);
      }
    );
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

     
      this.closeModal();
    } else {
      alert('Seleziona taglia e quantità valide prima di aggiungere al carrello.');
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }
}
