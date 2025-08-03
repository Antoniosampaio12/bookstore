import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../../core/services/auth.service';
import { ErrorMapperService, MappedError } from '../../../core/services/error-mapper.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  mappedError: MappedError | null = null;

  // Mapeamento de campos para nomes amigáveis
  private fieldLabels: { [key: string]: string } = {
    name: 'Nome',
    email: 'E-mail',
    password: 'Senha'
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorMapper: ErrorMapperService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.clearMessages();

      const registerData: RegisterData = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          this.showMessage('Registro realizado com sucesso! Redirecionando para login...', 'success');
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.mappedError = this.errorMapper.mapError(error);
          this.showMessage(this.mappedError.message, 'error');
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
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
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      const fieldLabel = this.fieldLabels[fieldName] || fieldName;
      if (field.errors['required']) return `${fieldLabel} é obrigatório`;
      if (field.errors['email']) return 'Formato de e-mail inválido';
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldLabel} deve ter pelo menos ${requiredLength} caracteres`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    // Campo é inválido se tem erro mapeado ou erro de validação local
    if (this.mappedError && this.errorMapper.hasFieldError(this.mappedError, fieldName)) {
      return true;
    }
    
    const field = this.registerForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}