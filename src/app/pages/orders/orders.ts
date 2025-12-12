import { Component, inject, OnInit } from '@angular/core';
import OrderModel from '../../models/order';
import { Cart } from '../../services/cart';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {

  placedOrders: OrderModel[] = [];
  carts = inject(Cart)

  ngOnInit(): void {
    this.carts.emitPlacedOrders.subscribe((orders: OrderModel[]) => {
      this.placedOrders = orders;
    });
  }

}
