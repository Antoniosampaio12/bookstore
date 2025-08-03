import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../../core/services/auth.service';
import { ErrorMapperService, MappedError } from '../../../core/services/error-mapper.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  mappedError: MappedError | null = null;

  // Mapeamento de campos para nomes amigáveis
  private fieldLabels: { [key: string]: string } = {
    email: 'E-mail',
    password: 'Senha'
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorMapper: ErrorMapperService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.clearMessages();

      const loginData: LoginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.loading = false;
          this.showMessage('Login realizado com sucesso!', 'success');
          // Redireciona para a página de livros após login bem-sucedido
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.mappedError = this.errorMapper.mapError(error);
          this.showMessage(this.mappedError.message, 'error');
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
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
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      const fieldLabel = this.fieldLabels[fieldName] || fieldName;
      if (field.errors['required']) return `${fieldLabel} é obrigatório`;
      if (field.errors['email']) return 'Formato de e-mail inválido';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    // Campo é inválido se tem erro mapeado ou erro de validação local
    if (this.mappedError && this.errorMapper.hasFieldError(this.mappedError, fieldName)) {
      return true;
    }
    
    const field = this.loginForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}