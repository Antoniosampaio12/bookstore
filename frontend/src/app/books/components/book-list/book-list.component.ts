import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService, Book, BookSearchParams } from '../../../core/services/books.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  searchForm: FormGroup;
  
  // UI States
  loading = false;
  showDeleteConfirmation = false;
  showSuccessModal = false;
  successMessage = '';
  selectedBook: Book | null = null;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  limit = 10;
  total = 0;

  // Authentication
  isAuthenticated = false;

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private authService: AuthService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      title: [''],
      author: [''],
      genre: [''],
      limit: [10, [Validators.min(1), Validators.max(50)]]
    });

    // Subscribe to authentication status
    this.authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
      }
    );
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  // Search and Load Books
  onSearch(): void {
    this.currentPage = 1;
    this.limit = this.searchForm.get('limit')?.value || 10;
    this.loadBooks();
  }

  loadBooks(page: number = this.currentPage): void {
    this.loading = true;
    this.clearMessage();

    const searchParams: BookSearchParams = {
      title: this.searchForm.get('title')?.value || undefined,
      author: this.searchForm.get('author')?.value || undefined,
      genre: this.searchForm.get('genre')?.value || undefined,
      page,
      limit: this.limit
    };

    // Remove empty values
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key as keyof BookSearchParams] === undefined || searchParams[key as keyof BookSearchParams] === '') {
        delete searchParams[key as keyof BookSearchParams];
      }
    });

    this.booksService.getBooks(searchParams).subscribe({
      next: (response) => {
        this.books = response.data || response as any;
        if (response.meta) {
          this.currentPage = response.meta.page;
          this.totalPages = response.meta.totalPages;
          this.total = response.meta.total;
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Erro ao carregar livros. Tente novamente.', 'error');
        console.error('Error loading books:', error);
      }
    });
  }

  clearSearch(): void {
    this.searchForm.reset({ limit: 10 });
    this.currentPage = 1;
    this.limit = 10;
    this.loadBooks();
  }

  // Navigation
  viewBook(book: Book): void {
    this.router.navigate(['/books', book.id]);
  }

  createBook(): void {
    if (!this.isAuthenticated) {
      this.showMessage('Você precisa estar logado para criar um livro.', 'error');
      return;
    }
    this.router.navigate(['/books/create']);
  }

  editBook(book: Book): void {
    if (!this.isAuthenticated) {
      this.showMessage('Você precisa estar logado para editar um livro.', 'error');
      return;
    }
    this.router.navigate(['/books/edit', book.id]);
  }

  // Delete Book
  deleteBook(book: Book): void {
    if (!this.isAuthenticated) {
      this.showMessage('Você precisa estar logado para excluir um livro.', 'error');
      return;
    }

    this.selectedBook = book;
    this.showDeleteConfirmation = true;
  }

  confirmDelete(): void {
    if (this.selectedBook?.id) {
      this.loading = true;
      this.showDeleteConfirmation = false;
      
      this.booksService.deleteBook(this.selectedBook.id).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccessMessage('Livro excluído com sucesso!');
          this.selectedBook = null;
          this.loadBooks();
        },
        error: (error) => {
          this.loading = false;
          this.showMessage(error.error?.message || 'Erro ao excluir livro.', 'error');
          this.selectedBook = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.selectedBook = null;
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadBooks(page);
    }
  }

  // Utility Methods
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successMessage = '';
  }

  private clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }
}