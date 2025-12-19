import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Cart } from '../../services/cart';
import { Auth } from '../../services/auth';
import OrderModel from '../../models/order';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  cartService = inject(Cart);
  authService = inject(Auth);
  cdr = inject(ChangeDetectorRef)
  
  cartCount: number = 0;
  recentOrders: OrderModel[] = JSON.parse(localStorage.getItem('orders') || '[]');
  orderCount: number = this.recentOrders?.length;
  isAuthenticated: boolean = false;

  username: string = '';

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    // Subscribe to cart count
    this.cartService.emitSelectedProductCount.subscribe((count: number) => {
      this.cartCount = count;
    });

    // Load orders if authenticated
    if (this.isAuthenticated) {
      this.loadOrders();
      this.getUsername();
    } else {
      console.log('User not authenticated, skipping order load');
    }
  }

  private loadOrders(): void {
    this.cartService.getOrders().subscribe({
      next: (orders: OrderModel[]) => {
        this.recentOrders = orders;
        this.orderCount = orders.length;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  private getUsername(): void {
    const token: string | null = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) return;
    
    try {
      const payload: any = JSON.parse(atob(token.split('.')[1]));
      this.username = payload.username;
    } catch {
      this.username = '';
    }
  }
}
