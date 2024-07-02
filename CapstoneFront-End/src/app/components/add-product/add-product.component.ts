import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  product: Product = { name: '', description: '', img: '', price: 0, category: '' };

  constructor(private dataService: DataService) {}

  onSubmit() {
    this.dataService.addProduct(this.product).subscribe(response => {
      console.log('Prodotto aggiunto con successo!', response);
      // Aggiungi eventuali azioni aggiuntive, come la navigazione a un'altra pagina
    }, error => {
      console.error('Errore durante l\'aggiunta del prodotto', error);
    });
  }
}
