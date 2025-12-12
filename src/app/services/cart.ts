import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import ProductsModel from '../models/products';
import OrderModel from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  
  selectedCart: ProductsModel[] = this.getFromStorage('cart', []);
  selectedProductCount: number = parseInt(localStorage.getItem('cartCount') || '0');
  emitSelectedCart: BehaviorSubject<ProductsModel[]> = new BehaviorSubject<ProductsModel[]>(this.selectedCart);
  emitSelectedProductCount: BehaviorSubject<number> = new BehaviorSubject<number>(this.selectedProductCount);

  deliveryDate!: Date;

  emitPlacedOrders: BehaviorSubject<OrderModel[]> = new BehaviorSubject<OrderModel[]>(this.getFromStorage('orders', []));

  placedOrders: OrderModel[] = this.getFromStorage('orders', []);

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
      this.emitSelectedCart.next(this.selectedCart);
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
    this.emitSelectedCart.next(this.selectedCart);
    this.emitSelectedProductCount.next(this.selectedProductCount);
  }

  clearCart(): void{
    this.selectedCart = [];
    this.selectedProductCount = 0;
    this.removeFromStorage('cart');
    this.removeFromStorage('cartCount');
    this.emitSelectedCart.next(this.selectedCart);
    this.emitSelectedProductCount.next(this.selectedProductCount);
  }

  placeOrder(order: OrderModel): void{
    this.placedOrders.push(order);
    this.saveToStorage('orders', this.placedOrders);
    this.emitPlacedOrders.next(this.placedOrders);
  }

  
}
