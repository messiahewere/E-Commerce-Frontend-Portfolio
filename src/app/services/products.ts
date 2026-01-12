import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ProductsModel from '../models/products';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Products {
  http: HttpClient = inject(HttpClient);


  getProducts(): Observable<ProductsModel[]> {
    return this.http.get<ProductsModel[]>(`${environment.apiUrl}/products`);
  }

  createProducts(formData: FormData) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
   return this.http.post(`${environment.apiUrl}/admin/product`, formData, { headers })
  }

  deleteProduct(productId: number): Observable<any> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.delete(`${environment.apiUrl}/admin/product/${productId}`, { headers });
  }
}
