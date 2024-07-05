import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Product } from 'src/app/models/product';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string | undefined;
  editProduct: Product = {
    name: '',
    description: '',
    img: '',
    price: 0,
    category: ''
  }; // Inizializzazione con un oggetto che contiene tutte le proprietà obbligatorie di Product

  constructor(private dataService: DataService) {
    this.categories = [];
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.extractCategories();
    });
  }

  extractCategories(): void {
    const uniqueCategories = new Set<string>();
    this.products.forEach(product => uniqueCategories.add(product.category));
    this.categories = Array.from(uniqueCategories);
  }

  deleteProduct(id?: number): void {
    if (id !== undefined) {
      this.dataService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(product => product.id !== id);
      });
    }
  }

  filterByCategory(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedCategory = selectedValue !== "" ? selectedValue : undefined;
  }

  clearFilter(): void {
    this.selectedCategory = undefined;
  }

  isProductInSelectedCategory(product: Product): boolean {
    return !this.selectedCategory || product.category === this.selectedCategory;
  }

  openEditModal(product: Product): void {
    // Assegna il prodotto da modificare all'oggetto editProduct
    this.editProduct = { ...product };
  }

  updateProduct(form: NgForm): void {
    if (form.invalid) {
      // Form non valido, gestisci l'errore o la validazione come necessario
      return;
    }

    // Chiamata al servizio per aggiornare il prodotto
    this.dataService.updateProduct(this.editProduct).subscribe(updatedProduct => {
      // Aggiorna l'elenco dei prodotti localmente
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = { ...updatedProduct };
      }

      // Chiudi la modale dopo l'aggiornamento (questo dipende dalla tua implementazione)
      // Esempio con Bootstrap modale
      const modal = document.getElementById('exampleModal');
      if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
      }

      // Resetta l'oggetto editProduct
      this.editProduct = {
        name: '',
        description: '',
        img: '',
        price: 0,
        category: ''
      };
    });
  }
}
