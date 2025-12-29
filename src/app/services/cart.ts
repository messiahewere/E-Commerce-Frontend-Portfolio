import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import ProductsModel from '../models/products';
import OrderModel from '../models/order';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  http: HttpClient = inject(HttpClient);
  authToken: string = localStorage.getItem('token') || '';
  auth = inject(Auth)
  
  selectedCart: ProductsModel[] = this.getFromStorage('cart', []);
  selectedProductCount: number = parseInt(localStorage.getItem('cartCount') || '0');
  emitSelectedCart: BehaviorSubject<ProductsModel[]> = new BehaviorSubject<ProductsModel[]>(this.selectedCart);
  emitSelectedProductCount: BehaviorSubject<number> = new BehaviorSubject<number>(this.selectedProductCount);

  deliveryDate!: Date;

  // emitPlacedOrders: BehaviorSubject<OrderModel[]> = new BehaviorSubject<OrderModel[]>(this.getFromStorage('orders', []));

  // placedOrders: OrderModel[] = this.getFromStorage('orders', []);

  constructor() {
    this.auth.emitToken.subscribe((token: string) => {
      this.authToken = token;
    });
  }

  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
    } catch {
      return defaultValue;
    }
  }


  private saveToStorage(key: string, value: any): void {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch {}
  }

  private removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  }



  // method to add a product to the cart after being called from the ProductCards component
  addToCart(product: ProductsModel): void {
    let existingProductIndex = this.selectedCart.findIndex(p => p._id === product._id);
    if (existingProductIndex !== -1) {
      const existingProduct = this.selectedCart[existingProductIndex];
      const newCount = existingProduct.count ? existingProduct.count + 1 : 1;
      this.selectedCart[existingProductIndex] = { ...existingProduct, count: newCount };
      this.selectedProductCount++;
      this.saveToStorage('cart', this.selectedCart);
      this.saveToStorage('cartCount', this.selectedProductCount.toString());
      this.emitSelectedCart.next([...this.selectedCart]);
      this.emitSelectedProductCount.next(this.selectedProductCount);
      return;
      
    }

    const today = new Date();
    const deliveryDays = today.getDay() === 0 ? 8 : 7;
    this.deliveryDate = new Date(today.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    const productToAdd = { ...product, count: 1, deliveryDate: this.deliveryDate};
    this.selectedCart.push(productToAdd);
    this.selectedProductCount++;
    this.saveToStorage('cart', this.selectedCart);
    this.saveToStorage('cartCount', this.selectedProductCount.toString());
    this.emitSelectedCart.next([...this.selectedCart]);
    this.emitSelectedProductCount.next(this.selectedProductCount);
  }

  clearCart(): void{
    this.selectedCart = [];
    this.selectedProductCount = 0;
    this.removeFromStorage('cart');
    this.removeFromStorage('cartCount');
    this.emitSelectedCart.next([...this.selectedCart]);
    this.emitSelectedProductCount.next(this.selectedProductCount);
  }


  removeFromCart(product: ProductsModel): void {
    const index = this.selectedCart.findIndex(p => p._id === product._id);
    if (index !== -1) {
      const existingProduct = this.selectedCart[index];
      if (existingProduct.count && existingProduct.count > 1) {
        this.selectedCart[index] = { ...existingProduct, count: existingProduct.count - 1 };
        this.selectedProductCount--;
      } else {
        // Remove entire product, decrease count by remaining quantity
        this.selectedProductCount -= (existingProduct.count || 1);
        this.selectedCart.splice(index, 1);
      }
      this.saveToStorage('cart', this.selectedCart);
      this.saveToStorage('cartCount', this.selectedProductCount.toString());
      this.emitSelectedCart.next([...this.selectedCart]);
      this.emitSelectedProductCount.next(this.selectedProductCount);
    }
  }

  addItemToCart(product: ProductsModel): void {
    const index = this.selectedCart.findIndex(p => p._id === product._id);
    if (index !== -1) {
      const existingProduct = this.selectedCart[index];
      this.selectedCart[index] = { ...existingProduct, count: existingProduct.count ? existingProduct.count + 1 : 1 };
      this.selectedProductCount++;
      this.saveToStorage('cart', this.selectedCart);
      this.saveToStorage('cartCount', this.selectedProductCount.toString());
      this.emitSelectedCart.next([...this.selectedCart]);
      this.emitSelectedProductCount.next(this.selectedProductCount);
    }
  }


  placeOrder(order: OrderModel): void{
    // make a post request to the endpoint by creating a new cart selection from the selected item(s)
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    this.http.post<OrderModel>('https://e-commerce-backend-portfolio.onrender.com/api/cart', order, { headers }).subscribe();
    // this.saveToStorage('orders', this.placedOrders);
    // this.emitPlacedOrders.next(this.placedOrders);
  }

  getOrders(): Observable<OrderModel[]> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<OrderModel[]>('https://e-commerce-backend-portfolio.onrender.com/api/cart', { headers });
  }

  getAllOrders(): Observable<OrderModel[]> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<OrderModel[]>('https://e-commerce-backend-portfolio.onrender.com/api/admin/orders', { headers });
  }

  updateOrderStatus(orderId: string, status: string): Observable<OrderModel> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.patch<OrderModel>(`https://e-commerce-backend-portfolio.onrender.com/api/admin/order/status/${orderId}`, { status }, { headers });
  }

  deleteOrder(orderId: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.delete(`https://e-commerce-backend-portfolio.onrender.com/api/admin/order/${orderId}`, { headers });
  }

  
}
