import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import OrderModel from '../../models/order';
import { Cart } from '../../services/cart';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit, OnDestroy {

  placedOrders: OrderModel[] = [];
  carts = inject(Cart)
  cdr = inject(ChangeDetectorRef)
  private subscription?: Subscription;
  token: string = localStorage.getItem('token') || '';

  ngOnInit(): void {
    // this.carts.emitPlacedOrders.subscribe((orders: OrderModel[]) => {
    //   this.placedOrders = orders;
    // });
    if(this.token) {
      this.subscription = this.carts.getOrders().subscribe({
      next: (orders: OrderModel[]) => {
        this.placedOrders = orders;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if(err.error.status === 401) {
          this.placedOrders = [];
        }
      }
    })
    }
    
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
