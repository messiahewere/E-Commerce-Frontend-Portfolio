import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import ProductsModel from '../../models/products';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Search } from '../../services/search';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { Cart } from '../../services/cart';

@Component({
  selector: 'product-cards',
  imports: [CommonModule, CurrencyPipe, MatIcon],
  templateUrl: './product-cards.html',
  styleUrl: './product-cards.scss',
})
export class ProductCards implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true })
  products!: ProductsModel[];

  showProducts: ProductsModel[] = [];
  currentSearchValue: string = '';

  cart = inject(Cart);

  private $destroy: Subject<void> = new Subject<void>();

  search = inject(Search);

  ngOnInit() {
    // subscribe to the search input value from the Search service
    this.search.searchEmit.pipe(takeUntil(this.$destroy)).subscribe((searchValue: string) => {
      this.currentSearchValue = searchValue;
      this.applyFilters();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.products) {
      this.applyFilters();
    }
  }

  // method to filter products based on the current search value and selected category if no search input is entered
  private applyFilters(): void {
    if (!this.products) return;
    if (this.currentSearchValue) {
      this.showProducts = this.products.filter((product: ProductsModel) => 
        product.title.toLowerCase().includes(this.currentSearchValue.trim().toLowerCase())
      );
      if (this.showProducts.length === 0) {
        setTimeout(() => {
          alert('No products found matching your search criteria.');
        }, 0); 
        this.showProducts = this.products;
        this.currentSearchValue = ''; /* This line sets the search value to an empty string, to stop the alert if no 
        new input is added or search button is clicked again*/
        
      }
     
    } else {
      this.showProducts = this.products;
    }
  }


  // method to handle adding a product to the cart
  onAddToCart(product: ProductsModel): void {
    this.cart.addToCart(product);
  }


  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

}
