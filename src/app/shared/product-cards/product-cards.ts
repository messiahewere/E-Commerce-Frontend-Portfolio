import { Component, inject, Input, OnInit } from '@angular/core';
import ProductsModel from '../../models/products';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Search } from '../../services/search';

@Component({
  selector: 'product-cards',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-cards.html',
  styleUrl: './product-cards.scss',
})
export class ProductCards implements OnInit {
  @Input({ required: true })
  products!: ProductsModel[];
  showProducts: ProductsModel[] = [];

  search = inject(Search);

  ngOnInit() {
    this.showProducts = this.products;
    
    // subscribe to the search input value from the Search service
    this.search.searchEmit.subscribe((searchValue: string) => {
      if (searchValue) {
        this.showProducts = this.products.filter((product: ProductsModel) => product.title.toLowerCase().includes(searchValue.toLowerCase()));
      } else {
        this.showProducts = this.products;
      }
    });
 }
}
