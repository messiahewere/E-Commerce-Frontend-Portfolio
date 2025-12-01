import { Component, Input, OnInit } from '@angular/core';
import ProductsModel from '../../models/products';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-cards',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-cards.html',
  styleUrl: './product-cards.scss',
})
export class ProductCards implements OnInit {
  @Input({ required: true })
  products!: ProductsModel[];

  ngOnInit() {
    this.products.forEach((product, index) => {
      console.log(`Product ${index} images:`, product.images);
      console.log(`First image URL:`, product.images[0]);
      console.log(`URL length:`, product.images[0]?.length);
    });
  }
}
