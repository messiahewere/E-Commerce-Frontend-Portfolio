import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import OrderModel from '../../models/order';
import { Cart } from '../../services/cart';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, CurrencyPipe, DatePipe, MatSelectModule, MatButtonModule, MatCardModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit, OnDestroy {
  allOrders: OrderModel[] = [];
  cart = inject(Cart);
  cdr = inject(ChangeDetectorRef);
  private _snackBar = inject(MatSnackBar);
  private subscription?: Subscription;
  
  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  ngOnInit(): void {
    this.loadAllOrders();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadAllOrders(): void {
    this.subscription = this.cart.getAllOrders().subscribe({
      next: (orders: OrderModel[]) => {
        this.allOrders = orders;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this._snackBar.open('Failed to load orders', 'Close', { duration: 3000 });
      }
    });
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.cart.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        const orderIndex = this.allOrders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
          this.allOrders[orderIndex] = updatedOrder;
          this.cdr.detectChanges();
        }
        this._snackBar.open('Order status updated successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this._snackBar.open('Failed to update order status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.cart.deleteOrder(orderId).subscribe({
        next: () => {
          this.allOrders = this.allOrders.filter(order => order._id !== orderId);
          this.cdr.detectChanges();
          this._snackBar.open('Order deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this._snackBar.open('Failed to delete order', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ff9800';
      case 'processing': return '#2196f3';
      case 'shipped': return '#9c27b0';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  }
}
