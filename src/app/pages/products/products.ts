import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import ProductsModel from '../../models/products';
import { ProductCards } from '../../shared/product-cards/product-cards';
import { Products as ProductsService } from '../../services/products';
import { CommonModule} from '@angular/common';
import {MatSelectModule, MatSelectChange} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-products',
  imports: [ProductCards, CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})

export class Products implements OnInit {
  allProducts: ProductsModel[] = [];
  toShowProducts!: ProductsModel[];

  productsService = inject(ProductsService);
  cdr = inject(ChangeDetectorRef);

  selected = localStorage.getItem('selectedCategory') || 'All';


  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data: ProductsModel[]) => {
      this.allProducts = data;
      this.applyFilter(this.selected);
      this.cdr.detectChanges();
    });
  }

  // the filter function for mat-select when the select dropdown value changes
  onSelect(event: MatSelectChange): void {
    localStorage.setItem('selectedCategory', event.value);
    this.applyFilter(event.value);
  }

  private applyFilter(category: string): void {
    if (category && category !== 'All') {
      this.toShowProducts = this.allProducts.filter((product: ProductsModel) => product.category === category);
    } else {
      this.toShowProducts = this.allProducts;
    }
  }

}
