import { Component, inject, OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import ProductsModel from '../../models/products';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carts',
  imports: [NgFor, DatePipe, CurrencyPipe, RouterModule],
  templateUrl: './carts.html',
  styleUrl: './carts.scss',
})
export class Carts implements OnInit{

  cart = inject(Cart);

  count: number = 0;

  selectedCart: ProductsModel[] = [];
  deliveryDate!: Date;
  itemsArray: number[] = [];
  itemsPrice: number = 0;
  tax: number = 0;
  shipping: number = 0;
  total: number = 0;

  ngOnInit(): void {
    this.cart.emitSelectedCart.subscribe((cart: ProductsModel[]) => {
      this.selectedCart = cart;
      const today = new Date();
      // condition to avoid delivery date falling on Sunday when the order is made on Sunday
      if(today.getDay() < 7){
        this.deliveryDate = new Date(today.setDate(today.getDate() + 7));
      } else {
        this.deliveryDate = new Date(today.setDate(today.getDate() + 7));
      }

      this.selectedCart.forEach((product: ProductsModel) => {
        const itemPrice = product.price * (product.count ?? 1);
        this.itemsArray.push(itemPrice);
      })
      // calculating the items price for all the order made excluding tax and shipping
      this.itemsPrice = this.itemsArray.reduce((acc, curr) => acc + curr, 0);
      this.tax = this.itemsPrice * 0.1;
      this.total = this.itemsPrice + this.tax + this.shipping;

    });

    this.cart.emitselectedProductCount.subscribe((count: number) => {
      this.count = count;
      this.shipping = this.count * 1.1;
    });

  }

}
