import { Component } from '@angular/core';
import { ProductCards } from '../../shared/product-cards/product-cards';

@Component({
  selector: 'app-home',
  imports: [ProductCards],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
