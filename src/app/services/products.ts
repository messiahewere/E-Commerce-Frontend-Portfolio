import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ProductsModel from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class Products {
  http: HttpClient = inject(HttpClient);


  getProducts(): Observable<ProductsModel[]> {
    return this.http.get<ProductsModel[]>('https://e-commerce-backend-portfolio.onrender.com/api/products');
  }

  getAllProducts(): Observable<ProductsModel[]> {
    return this.http.get<ProductsModel[]>('https://e-commerce-backend-portfolio.onrender.com/api/products');
  }

  createProducts(formData: FormData) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
   return this.http.post('https://e-commerce-backend-portfolio.onrender.com/api/admin/product', formData, { headers })
  }

  deleteProduct(productId: number): Observable<any> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.delete(`https://e-commerce-backend-portfolio.onrender.com/api/admin/product/${productId}`, { headers });
  }
}
