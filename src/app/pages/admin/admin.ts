import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import OrderModel from '../../models/order';
import ProductsModel from '../../models/products';
import { Cart } from '../../services/cart';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Products } from '../../services/products';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, CurrencyPipe, DatePipe, MatSelectModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit, OnDestroy {
  allOrders: OrderModel[] = JSON.parse(localStorage.getItem('allOrders') || '[]');
  cart = inject(Cart);
  products = inject(Products);
  cdr = inject(ChangeDetectorRef);
  private _snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);
  private subscription?: Subscription;

  newProduct: ProductsModel = new ProductsModel(0, '', '', 0, '', '', 0, 0, []);
  showAddProductForm = false;
  selectedFiles: File[] = [];
  allProducts: ProductsModel[] = [];
  showProductsSection = false;
  
  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  ngOnInit(): void {
    this.loadAllOrders();
    this.loadAllProducts();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadAllOrders(): void {
    this.subscription = this.cart.getAllOrders().subscribe({
      next: (orders: OrderModel[]) => {
        this.allOrders = orders;
        localStorage.setItem('allOrders', JSON.stringify(orders));
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

  toggleAddProductForm(): void {
    this.showAddProductForm = !this.showAddProductForm;
    if (!this.showAddProductForm) {
      this.resetProductForm();
    }
  }

  resetProductForm(): void {
    this.newProduct = new ProductsModel(0, '', '', 0, '', '', 0, 0, []);
    this.selectedFiles = [];
  }

  addProduct(): void {
    // Validate required fields
    if (!this.newProduct.title || !this.newProduct.description || !this.newProduct.price || 
        !this.newProduct.category || !this.newProduct.brand || !this.newProduct.stock) {
      this._snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    
    formData.append('title', this.newProduct.title);
    formData.append('description', this.newProduct.description);
    formData.append('price', this.newProduct.price.toString());
    formData.append('category', this.newProduct.category);
    formData.append('brand', this.newProduct.brand);
    formData.append('rating', this.newProduct.rating.toString());
    formData.append('stock', this.newProduct.stock.toString());
    
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.products.createProducts(formData).subscribe({
        next: () => {
          this._snackBar.open('Product added successfully', 'Close', { duration: 3000 });
          this.resetProductForm();
          this.showAddProductForm = false;
          this.resetProductForm();
          this.loadAllProducts();
        },
        error: () => {
          this._snackBar.open('Failed to add product', 'Close', { duration: 3000 });
          this.resetProductForm();
        }
      });
  }

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  loadAllProducts(): void {
    this.products.getAllProducts().subscribe({
      next: (products: ProductsModel[]) => {
        this.allProducts = products;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this._snackBar.open('Failed to load products', 'Close', { duration: 3000 });
      }
    });
  }

  toggleProductsSection(): void {
    this.showProductsSection = !this.showProductsSection;
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products.deleteProduct(productId).subscribe({
        next: () => {
          this.allProducts = this.allProducts.filter(product => product._id !== productId);
          this.cdr.detectChanges();
          this._snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this._snackBar.open('Failed to delete product', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
