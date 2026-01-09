import { Component, inject, OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import ProductsModel from '../../models/products';
import { CommonModule, CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import OrderModel from '../../models/order';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-carts',
  imports: [NgFor, DatePipe, CurrencyPipe, RouterModule, CommonModule],
  templateUrl: './carts.html',
  styleUrl: './carts.scss',
})
export class Carts implements OnInit{

  cart = inject(Cart);
  router = inject(Router);
  auth = inject(Auth)

  count: number = 0;

  selectedCart: ProductsModel[] = [];
  itemsArray: number[] = [];
  itemsPrice: number = 0;
  tax: number = 0;
  shipping: number = 0;
  total: number = 0;

  order!: OrderModel;

  authToken: string = '';

  ngOnInit(): void {
    this.cart.emitSelectedCart.subscribe((cart: ProductsModel[]) => {
      this.selectedCart = cart;
      this.itemsArray = []; // Clear array before recalculating

      this.selectedCart.forEach((product: ProductsModel) => {
        const itemPrice = product.price * (product.count || 1);
        this.itemsArray.push(itemPrice);
      })
      // calculating the items price for all the order made excluding tax and shipping
      this.itemsPrice = this.itemsArray.reduce((acc, curr) => acc + curr, 0);
      this.tax = this.itemsPrice * 0.1;
      this.total = this.itemsPrice + this.tax + this.shipping;

    });

    // retriving the number of items selected
    this.cart.emitSelectedProductCount.subscribe((count: number) => {
      this.count = count;
      this.shipping = this.count * 1.1;
      // Recalculate total when count changes
      this.total = this.itemsPrice + this.tax + this.shipping;
    });

    // subscribing to the auth token
    this.auth.emitToken.subscribe((token: string) => {
      this.authToken = token;
    })

  }

  onOrderClick() {
    
    // Check if token is valid 
    if(!this.authToken) {
      alert('Please Login to continue with your order');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/carts' }});
      return;
    }
    
    if(this.selectedCart.length > 0){
      const today = new Date();
      this.order = new OrderModel(this.total, this.selectedCart, today);
      this.cart.placeOrder(this.order);
    } else {
      alert('No items in cart');
      return;
    }

    this.cart.clearCart();
    this.resetStates();
    this.router.navigate(['/orders']);
  }

  // Method to increase the quantity of selected cart item
  onAddClick(selectedCart: ProductsModel) {
    this.cart.addItemToCart(selectedCart);
  }

  onDeleteClick(selectedCart: ProductsModel) {
    this.cart.removeFromCart(selectedCart);
  }

  private resetStates() {
    this.selectedCart = [];
    this.count = 0;
    this.itemsArray = [];
    this.itemsPrice = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;   
  }

}
