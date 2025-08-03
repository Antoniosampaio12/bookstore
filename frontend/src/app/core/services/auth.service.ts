import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: any;
  message?: string;
}

export interface ProfileResponse {
  user: UserProfile;
}

export interface UserProfile {
  name: string;
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3333/api';
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.hasToken();
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Profile response:', response)), // Para debug
      map(response => response.user)
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.removeToken();
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return this.http.delete(`${this.apiUrl}/logout`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.removeToken();
      }),
      // Em caso de erro, ainda remove o token localmente
      catchError((error) => {
        console.error('Erro ao fazer logout no servidor:', error);
        this.removeToken();
        return new Observable(observer => {
          observer.next(null);
          observer.complete();
        });
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}