import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {Router, RouterLink} from "@angular/router";
import { Search } from '../../services/search';
import { Cart } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatMenuModule, MatBadgeModule, 
    RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit{

  search = inject(Search);
  cart = inject(Cart);
  count: number = 0;
  isProductInview: boolean = false;
  headerTitle: string = '';
  isAdmin: boolean = false; 

  token!: string;

  router = inject(Router)
  auth = inject(Auth)

  ngOnInit(): void {
    this.auth.emitToken.subscribe((token: string) => {
      this.token = token;
      // Check admin status whenever the token changes
      this.isAdmin = this.auth.isAdmin();
    })
    
    this.cart.emitSelectedProductCount.subscribe((count: number) => {
      this.count = count;
      // Update header title if on carts page
      if (this.router.url === '/carts') {
        this.headerTitle = `Checkout (${this.count} item${this.count !== 1 ? 's' : ''})`;
      }
    });

   this.router.events.subscribe(() => {
      switch(this.router.url){
        case '/products':
          this.isProductInview = true;
          break;
        case '/home':
          this.isProductInview = false;
          this.headerTitle = 'Home';
          break;
        case '/carts':
          this.isProductInview = false;
          this.updateCartsTitle();
          break;
        case '/orders':
          this.isProductInview = false;
          this.headerTitle = 'View Your Orders';
          break;
        case '/login':
          this.isProductInview = false;
          this.headerTitle = 'Register or Login';
          break;
        case '/dashboard':
          this.isProductInview = false;
          this.headerTitle = 'Dashboard';
          break;
        case '/admin':
          this.isProductInview = false;
          this.headerTitle = 'Admin Dashboard';
          break;
        default:
          this.isProductInview = false;
          this.headerTitle = '';
      }
 })


}

  // isAdmin(): boolean {
  //   return this.auth.isAdmin();
  // }

  onSearchProductName(inputValue: string): void {
    // emit the search input value to the Search service
    this.search.searchProductName(inputValue);
  }

  onLogOutClick() {
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }

  private updateCartsTitle() {
    this.headerTitle = `Checkout (${this.count} item${this.count !== 1 ? 's' : ''})`;
  }
}
