import { Injectable } from '@angular/core';

export interface MappedError {
  message: string;
  fieldErrors: { [key: string]: string };
  hasFieldErrors: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorMapperService {

  // Mapeamento de campos para nomes amigáveis
  private fieldNames: { [key: string]: string } = {
    'name': 'Nome',
    'email': 'E-mail',
    'password': 'Senha',
    'title': 'Título',
    'author': 'Autor',
    'genre': 'Gênero',
    'year': 'Ano',
    'isbn': 'ISBN',
    'ISBN': 'ISBN'
  };

  // Mensagens padrão para diferentes tipos de erro
  private errorMessages = {
    required: (field: string) => `${this.getFieldName(field)} é obrigatório`,
    unique: (field: string) => this.getUniqueMessage(field),
    exists: (field: string) => this.getUniqueMessage(field),
    duplicate: (field: string) => this.getUniqueMessage(field),
    invalid: (field: string) => this.getInvalidMessage(field),
    minLength: (field: string, min?: number) => `${this.getFieldName(field)} deve ter pelo menos ${min || 6} caracteres`,
    maxLength: (field: string, max?: number) => `${this.getFieldName(field)} deve ter no máximo ${max} caracteres`,
    min: (field: string, min?: number) => `${this.getFieldName(field)} deve ser maior que ${min}`,
    max: (field: string, max?: number) => `${this.getFieldName(field)} deve ser menor que ${max}`,
    email: () => 'Formato de e-mail inválido',
    credentials: () => 'E-mail ou senha incorretos'
  };

  /**
   * Mapeia erro do backend para mensagens amigáveis
   */
  mapError(error: any): MappedError {
    const result: MappedError = {
      message: '',
      fieldErrors: {},
      hasFieldErrors: false
    };

    // Extrair informações do erro
    const status = error.status || 0;
    const errorBody = error.error || error;
    const errorMessage = this.extractErrorMessage(errorBody);

    console.log('Mapeando erro:', { status, errorBody, errorMessage });

    // Tratar diferentes tipos de erro por status HTTP
    switch (status) {
      case 400:
        this.handleBadRequest(errorMessage, result);
        break;
      case 401:
        this.handleUnauthorized(errorMessage, result);
        break;
      case 409:
        this.handleConflict(errorMessage, result);
        break;
      case 422:
        this.handleValidationError(errorMessage, result);
        break;
      default:
        this.handleGenericError(errorMessage, result);
    }

    // Se não encontrou erros específicos de campo, tentar parsing genérico
    if (!result.hasFieldErrors) {
      this.parseGenericError(errorMessage, result);
    }

    // Definir mensagem principal se não foi definida
    if (!result.message) {
      result.message = result.hasFieldErrors ? 
        'Corrija os erros abaixo:' : 
        'Ocorreu um erro. Tente novamente.';
    }

    console.log('Resultado do mapeamento:', result);
    return result;
  }

  /**
   * Extrai mensagem de erro do objeto de resposta
   */
  private extractErrorMessage(errorBody: any): string {
    if (typeof errorBody === 'string') return errorBody;
    if (errorBody.message) return errorBody.message;
    if (errorBody.error) return errorBody.error;
    if (errorBody.details) return errorBody.details;
    return JSON.stringify(errorBody);
  }

  /**
   * Trata erros 400 (Bad Request)
   */
  private handleBadRequest(message: string, result: MappedError): void {
    // Detectar campos obrigatórios
    this.detectRequiredFields(message, result);
    
    // Detectar validações de formato
    this.detectFormatErrors(message, result);
    
    if (result.hasFieldErrors) {
      result.message = 'Corrija os erros abaixo:';
    } else {
      result.message = 'Dados fornecidos são inválidos.';
    }
  }

  /**
   * Trata erros 401 (Unauthorized)
   */
  private handleUnauthorized(message: string, result: MappedError): void {
    // Detectar erro de credenciais
    if (this.containsAny(message, ['password', 'credential', 'login', 'auth', 'invalid'])) {
      result.fieldErrors['email'] = 'Verifique suas credenciais';
      result.fieldErrors['password'] = 'Verifique suas credenciais';
      result.hasFieldErrors = true;
      result.message = 'E-mail ou senha incorretos';
    } else {
      result.message = 'Acesso não autorizado. Faça login novamente.';
    }
  }

  /**
   * Trata erros 409 (Conflict) - Violação de unicidade
   */
  private handleConflict(message: string, result: MappedError): void {
    // Detectar qual campo tem conflito de unicidade
    Object.keys(this.fieldNames).forEach(field => {
      if (this.containsAny(message, [field]) && 
          this.containsAny(message, ['unique', 'exists', 'duplicate', 'already', 'já existe'])) {
        result.fieldErrors[field] = this.errorMessages.unique(field);
        result.hasFieldErrors = true;
      }
    });

    if (result.hasFieldErrors) {
      result.message = 'Dados já cadastrados no sistema.';
    } else {
      result.message = 'Conflito de dados. Verifique as informações.';
    }
  }

  /**
   * Trata erros 422 (Unprocessable Entity)
   */
  private handleValidationError(message: string, result: MappedError): void {
    this.parseGenericError(message, result);
    if (!result.message) {
      result.message = 'Erro de validação.';
    }
  }

  /**
   * Trata erros genéricos
   */
  private handleGenericError(message: string, result: MappedError): void {
    result.message = 'Ocorreu um erro inesperado. Tente novamente.';
  }

  /**
   * Faz parsing genérico da mensagem de erro
   */
  private parseGenericError(message: string, result: MappedError): void {
    const lowerMessage = message.toLowerCase();

    // Detectar campos obrigatórios
    this.detectRequiredFields(message, result);
    
    // Detectar erros de unicidade
    this.detectUniqueErrors(message, result);
    
    // Detectar erros de formato
    this.detectFormatErrors(message, result);
    
    // Detectar erros de tamanho
    this.detectLengthErrors(message, result);

    if (result.hasFieldErrors && !result.message) {
      result.message = 'Corrija os erros abaixo:';
    }
  }

  /**
   * Detecta campos obrigatórios na mensagem
   */
  private detectRequiredFields(message: string, result: MappedError): void {
    Object.keys(this.fieldNames).forEach(field => {
      const fieldVariations = [field, field.toLowerCase(), field.toUpperCase()];
      if (this.containsAny(message, fieldVariations) && 
          this.containsAny(message, ['required', 'obrigatório', 'not null', 'cannot be null', 'is required'])) {
        result.fieldErrors[field] = this.errorMessages.required(field);
        result.hasFieldErrors = true;
      }
    });
    
    // Detecção específica para ISBN (case variations)
    if (this.containsAny(message, ['isbn', 'ISBN']) && 
        this.containsAny(message, ['required', 'obrigatório', 'not null', 'cannot be null', 'is required'])) {
      result.fieldErrors['isbn'] = this.errorMessages.required('isbn');
      result.hasFieldErrors = true;
    }
  }

  /**
   * Detecta erros de unicidade na mensagem
   */
  private detectUniqueErrors(message: string, result: MappedError): void {
    Object.keys(this.fieldNames).forEach(field => {
      const fieldVariations = [field, field.toLowerCase(), field.toUpperCase()];
      if (this.containsAny(message, fieldVariations) && 
          this.containsAny(message, ['unique', 'exists', 'duplicate', 'already exists', 'já existe', 'constraint'])) {
        result.fieldErrors[field] = this.errorMessages.unique(field);
        result.hasFieldErrors = true;
      }
    });
    
    // Detecção específica para ISBN (case variations)
    if (this.containsAny(message, ['isbn', 'ISBN']) && 
        this.containsAny(message, ['unique', 'exists', 'duplicate', 'already', 'já existe', 'constraint'])) {
      result.fieldErrors['isbn'] = this.errorMessages.unique('isbn');
      result.hasFieldErrors = true;
    }
  }

  /**
   * Detecta erros de formato na mensagem
   */
  private detectFormatErrors(message: string, result: MappedError): void {
    // Email inválido
    if (this.containsAny(message, ['email']) && 
        this.containsAny(message, ['invalid', 'format', 'inválido', 'formato'])) {
      result.fieldErrors['email'] = this.errorMessages.email();
      result.hasFieldErrors = true;
    }
    
    // ISBN inválido
    if (this.containsAny(message, ['isbn', 'ISBN']) && 
        this.containsAny(message, ['invalid', 'format', 'inválido', 'formato'])) {
      result.fieldErrors['isbn'] = this.errorMessages.invalid('isbn');
      result.hasFieldErrors = true;
    }
  }

  /**
   * Detecta erros de tamanho na mensagem
   */
  private detectLengthErrors(message: string, result: MappedError): void {
    Object.keys(this.fieldNames).forEach(field => {
      // Tamanho mínimo
      const fieldVariations = [field, field.toLowerCase(), field.toUpperCase()];
      if (this.containsAny(message, fieldVariations) && 
          this.containsAny(message, ['min', 'minimum', 'at least', 'pelo menos'])) {
        const minValue = this.extractNumber(message);
        result.fieldErrors[field] = this.errorMessages.minLength(field, minValue);
        result.hasFieldErrors = true;
      }
      
      // Tamanho máximo
      if (this.containsAny(message, fieldVariations) && 
          this.containsAny(message, ['max', 'maximum', 'no more than', 'máximo'])) {
        const maxValue = this.extractNumber(message);
        result.fieldErrors[field] = this.errorMessages.maxLength(field, maxValue);
        result.hasFieldErrors = true;
      }
    });
    
    // Detecção específica para ISBN (case variations)
    if (this.containsAny(message, ['isbn', 'ISBN'])) {
      if (this.containsAny(message, ['min', 'minimum', 'at least', 'pelo menos'])) {
        const minValue = this.extractNumber(message);
        result.fieldErrors['isbn'] = this.errorMessages.minLength('isbn', minValue);
        result.hasFieldErrors = true;
      }
      if (this.containsAny(message, ['max', 'maximum', 'no more than', 'máximo'])) {
        const maxValue = this.extractNumber(message);
        result.fieldErrors['isbn'] = this.errorMessages.maxLength('isbn', maxValue);
        result.hasFieldErrors = true;
      }
    }
  }

  /**
   * Verifica se a mensagem contém alguma das palavras-chave
   */
  private containsAny(message: string, keywords: string[]): boolean {
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
  }

  /**
   * Extrai número da mensagem (para validações de tamanho)
   */
  private extractNumber(message: string): number | undefined {
    const match = message.match(/\d+/);
    return match ? parseInt(match[0]) : undefined;
  }

  /**
   * Obtém nome amigável do campo
   */
  private getFieldName(field: string): string {
    return this.fieldNames[field] || field;
  }

  /**
   * Obtém mensagem de unicidade específica por campo
   */
  private getUniqueMessage(field: string): string {
    const messages: { [key: string]: string } = {
      'email': 'Este e-mail já está cadastrado',
      'isbn': 'Este ISBN já está sendo usado em outro livro',
      'title': 'Já existe um livro com este título',
      'name': 'Este nome já está em uso'
    };
    return messages[field] || `${this.getFieldName(field)} já está em uso`;
  }

  /**
   * Obtém mensagem de formato inválido específica por campo
   */
  private getInvalidMessage(field: string): string {
    const messages: { [key: string]: string } = {
      'email': 'Formato de e-mail inválido',
      'year': 'Ano deve ser um número válido',
      'isbn': 'Formato de ISBN inválido'
    };
    return messages[field] || `${this.getFieldName(field)} tem formato inválido`;
  }

  /**
   * Verifica se há erro para um campo específico
   */
  hasFieldError(mappedError: MappedError, fieldName: string): boolean {
    return !!mappedError.fieldErrors[fieldName];
  }

  /**
   * Obtém mensagem de erro para um campo específico
   */
  getFieldError(mappedError: MappedError, fieldName: string): string {
    return mappedError.fieldErrors[fieldName] || '';
  }
}