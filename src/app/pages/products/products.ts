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

  selected = 'option2';


  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data: ProductsModel[]) => {
      this.allProducts = data;
      this.toShowProducts = this.allProducts;
      this.cdr.detectChanges();
    });
  }

  // the filter function for mat-select when the select dropdown value changes
  onSelect(event: MatSelectChange): void {
    switch(event.value) {
      case 'Electronics':
        this.toShowProducts = this.allProducts.filter((product: ProductsModel) => product.category === 'Electronics');
        break;
      case 'Fashion':
        this.toShowProducts = this.allProducts.filter((product: ProductsModel) => product.category === 'Fashion');
        break;
      case 'Home':
        this.toShowProducts = this.allProducts.filter((product: ProductsModel) => product.category === 'Home');
        break;
      case 'Beauty':
        this.toShowProducts = this.allProducts.filter((product: ProductsModel) => product.category === 'Beauty');
        break;
        case 'Sports':
        this.toShowProducts = this.allProducts.filter((product: ProductsModel) => product.category === 'Sports');
        break;
      default:
        this.toShowProducts = this.allProducts;
        break;
    }
  }

}
