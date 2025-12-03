import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Search {
  
  searchEmit: BehaviorSubject<string> = new BehaviorSubject<string>('');


  searchProductName(inputValue: string): void {
    this.searchEmit.next(inputValue);
  }


}
