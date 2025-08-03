import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService, Book } from '../../../core/services/books.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-book-detail',
  standalone: false, 
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private authService: AuthService
  ) {
    // Subscribe to authentication status
    this.authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
      }
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(+id);
    }
  }

  loadBook(id: number): void {
    this.loading = true;
    this.clearMessage();

    this.booksService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Erro ao carregar detalhes do livro.', 'error');
        console.error('Error loading book:', error);
      }
    });
  }

  editBook(): void {
    if (!this.isAuthenticated) {
      this.showMessage('Você precisa estar logado para editar um livro.', 'error');
      return;
    }
    if (this.book?.id) {
      this.router.navigate(['/books/edit', this.book.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  private clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }
}