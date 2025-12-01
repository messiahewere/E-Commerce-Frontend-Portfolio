import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import ProductsModel from '../../models/products';
import { ProductCards } from '../../shared/product-cards/product-cards';
import { Products as ProductsService } from '../../services/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [ProductCards, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  allProducts: ProductsModel[] = [];
  toShowProducts!: ProductsModel[];

  productsService = inject(ProductsService);
  cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data: ProductsModel[]) => {
      this.allProducts = data;
      this.toShowProducts = this.allProducts;
      this.cdr.detectChanges();
    });
  }

}
