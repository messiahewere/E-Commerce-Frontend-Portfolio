import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import ProductsModel from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  emitSelectedCart: BehaviorSubject<ProductsModel[]> = new BehaviorSubject<ProductsModel[]>([]);
  emitselectedProductCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedCart: ProductsModel[] = [];
  selectedProductCount: number = 0;



  // method to add a product to the cart after being called from the ProductCards component
  addToCart(product: ProductsModel): void {
    let existingProduct = this.selectedCart.find(p => p._id === product._id);
    if (existingProduct) {
      const newCount = existingProduct.count ? existingProduct.count + 1 : 1;
      const index = this.selectedCart.findIndex(p => p._id === product._id);
      this.selectedCart[index] = { ...existingProduct, count: newCount };
      this.selectedProductCount++;
      this.emitSelectedCart.next(this.selectedCart);
      this.emitselectedProductCount.next(this.selectedProductCount);
      return;
      
    }

    const productToAdd = { ...product, count: 1 };
    this.selectedCart.push(productToAdd);
    this.selectedProductCount++;
    this.emitSelectedCart.next(this.selectedCart);
    this.emitselectedProductCount.next(this.selectedProductCount);
  }
  
}
