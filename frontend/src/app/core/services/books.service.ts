import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Book {
  id?: number;
  title: string;
  author: string;
  genre: string;
 
  year?: number;
  isbn?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface BookSearchParams {
  title?: string;
  author?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

export interface BooksResponse {
  data: Book[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'http://localhost:3333/api/books';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getBooks(params?: BookSearchParams): Observable<BooksResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.title) httpParams = httpParams.set('title', params.title);
      if (params.author) httpParams = httpParams.set('author', params.author);
      if (params.genre) httpParams = httpParams.set('genre', params.genre);
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    } else {
      // Definir valores padrão se não houver parâmetros
      httpParams = httpParams.set('page', '1');
      httpParams = httpParams.set('limit', '10');
    }

   // console.log('Request params:', httpParams.toString());
    
    return this.http.get<BooksResponse>(this.apiUrl, { params: httpParams });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book, {
      headers: this.getAuthHeaders()
    });
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book, {
      headers: this.getAuthHeaders()
    });
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}