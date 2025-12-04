import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import ProductsModel from '../../models/products';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Search } from '../../services/search';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'product-cards',
  imports: [CommonModule, CurrencyPipe, MatIcon],
  templateUrl: './product-cards.html',
  styleUrl: './product-cards.scss',
})
export class ProductCards implements OnInit, OnChanges {
  @Input({ required: true })
  products!: ProductsModel[];
  showProducts!: ProductsModel[];
  currentSearchValue: string = '';

  search = inject(Search);

  ngOnInit() {
    // subscribe to the search input value from the Search service
    this.search.searchEmit.subscribe((searchValue: string) => {
      this.currentSearchValue = searchValue;
      this.applyFilters();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.products) {
      this.applyFilters();
    }
  }

  private applyFilters(): void {
    if (!this.products) return;
    if (this.currentSearchValue) {
      this.showProducts = this.products.filter((product: ProductsModel) => 
        product.title.toLowerCase().includes(this.currentSearchValue.trim().toLowerCase())
      );
     
    } else {
      this.showProducts = this.products;
    }
  }

}
