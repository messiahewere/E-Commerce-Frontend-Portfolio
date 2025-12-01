import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Products } from '../../services/products';
import ProductsModel from '../../models/products';
import { ProductCards } from '../../shared/product-cards/product-cards';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCards, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home implements OnInit {
  allProducts: ProductsModel[] = [];
  toShowProducts: ProductsModel[] | undefined;

  productsService = inject(Products);
  cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data: ProductsModel[]) => {
      this.allProducts = data;
      this.toShowProducts = this.allProducts.filter(product => product.rating >= 4.6);
      this.cdr.detectChanges();
    });
  }

}
