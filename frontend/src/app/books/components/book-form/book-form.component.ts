import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService, Book } from '../../../core/services/books.service';
import { ErrorMapperService, MappedError } from '../../../core/services/error-mapper.service';

@Component({
  selector: 'app-book-form',
  standalone: false,
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  mappedError: MappedError | null = null;
  isEditMode = false;
  bookId: number | null = null;
  showSuccessModal = false;
  successMessage = '';
  currentYear: number = new Date().getFullYear();

  // Mapeamento de campos para nomes amigáveis
  private fieldLabels: { [key: string]: string } = {
    title: 'Título',
    author: 'Autor',
    genre: 'Gênero',
    year: 'Ano de Publicação',
    isbn: 'ISBN'
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private errorMapper: ErrorMapperService
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      genre: ['', [Validators.required]],
      year: ['', [Validators.min(1000), Validators.max(new Date().getFullYear())]],
      isbn: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = +id;
      this.loadBook(this.bookId);
    }
  }

  loadBook(id: number): void {
    this.loading = true;
    this.booksService.getBook(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue(book);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Erro ao carregar dados do livro.', 'error');
        console.error('Error loading book:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.loading = true;
      this.clearMessages();

      const bookData = this.bookForm.value;

      if (this.isEditMode && this.bookId) {
        this.booksService.updateBook(this.bookId, bookData).subscribe({
          next: (updatedBook) => {
            this.loading = false;
            this.showSuccessMessage('Livro atualizado com sucesso!');
          },
          error: (error) => {
            this.loading = false;
            this.mappedError = this.errorMapper.mapError(error);
            this.showMessage(this.mappedError.message, 'error');
          }
        });
      } else {
        this.booksService.createBook(bookData).subscribe({
          next: (newBook) => {
            this.loading = false;
            this.showSuccessMessage('Livro criado com sucesso!');
          },
          error: (error) => {
            this.loading = false;
            this.mappedError = this.errorMapper.mapError(error);
            this.showMessage(this.mappedError.message, 'error');
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.bookForm);
    }
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successMessage = '';
    this.router.navigate(['/books']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.clearMessages(), 5000);
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  private clearMessages(): void {
    this.message = '';
    this.messageType = '';
    this.mappedError = null;
  }

  getFieldError(fieldName: string): string {
    // Primeiro verifica erros mapeados
    if (this.mappedError) {
      const mappedFieldError = this.errorMapper.getFieldError(this.mappedError, fieldName);
      if (mappedFieldError) return mappedFieldError;
    }
    
    // Depois verifica erros de validação do formulário
    const field = this.bookForm.get(fieldName);
    if (field?.errors && field.touched) {
      const fieldLabel = this.fieldLabels[fieldName] || fieldName;
      if (field.errors['required']) return `${fieldLabel} é obrigatório`;
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldLabel} deve ter pelo menos ${requiredLength} caracteres`;
      }
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    // Campo é inválido se tem erro mapeado ou erro de validação local
    if (this.mappedError && this.errorMapper.hasFieldError(this.mappedError, fieldName)) {
      return true;
    }
    
    const field = this.bookForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}