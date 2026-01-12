import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import authModel from '../models/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  emitToken: BehaviorSubject<string> = new BehaviorSubject<string>(this.getValidToken())

  http: HttpClient = inject(HttpClient);


  login(email: string, password: string): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${environment.apiUrl}/auth/login`, {
      email: email,
      password: password,
    });
  }

  register(username: string, email: string, password: string): Observable<authModel> {
    return this.http.post<authModel>(`${environment.apiUrl}/auth/register`, {
      username: username,
      email: email,
      password: password,
    });
  }

  // method called upon login
  useToken(token: string) {
    localStorage.setItem('token', token);
    this.emitToken.next(token);
  }

  private getValidToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    
    if (this.isTokenExpired(token)) {
      this.clearToken();
      return '';
    }
    return token;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  clearToken() {
    localStorage.removeItem('token');
    this.emitToken.next('');
  }

  isAuthenticated(): boolean {
    return !!this.getValidToken();
  }

  getUserRole(): string | null {
    const token = this.getValidToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
