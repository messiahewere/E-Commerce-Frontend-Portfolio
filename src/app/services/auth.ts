import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import authModel from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  emitToken: BehaviorSubject<string> = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('token') || 'null'))

  http: HttpClient = inject(HttpClient);


  login(email: string, password: string): Observable<string> {
    return this.http.post<string>('https://e-commerce-backend-portfolio.onrender.com/api/auth/login', {
      email: email,
      password: password,
    });
  }

  register(username: string, email: string, password: string): Observable<authModel> {
    return this.http.post<authModel>('https://e-commerce-backend-portfolio.onrender.com/api/auth/register', {
      username: username,
      email: email,
      password: password,
    });
  }

  useToken(token: string) {
    localStorage.setItem('token', token);
    this.emitToken.next(token);
  }
}
