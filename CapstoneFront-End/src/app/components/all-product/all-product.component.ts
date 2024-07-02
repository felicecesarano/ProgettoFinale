import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent implements OnInit {
  products: Product[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  deleteProduct(id?: number): void {
    if (id !== undefined) {
      this.dataService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(product => product.id !== id);
      });
    }
  }
}
