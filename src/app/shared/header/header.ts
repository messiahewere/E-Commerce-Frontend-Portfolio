import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Search } from '../../services/search';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-header',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatMenuModule, MatBadgeModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit{

  search = inject(Search);
  cart = inject(Cart);
  count: number = 0;

  ngOnInit(): void {
    this.cart.emitselectedProductCount.subscribe((count: number) => {
      this.count = count;
    });
  }


  onSearchProductName(inputValue: string): void {
    // emit the search input value to the Search service
    this.search.searchProductName(inputValue);
  }

}
