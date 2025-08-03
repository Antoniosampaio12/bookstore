# Exemplos de Erros que o ErrorMapperService Consegue Tratar

## 🎯 **Como Funciona**

O `ErrorMapperService` analisa mensagens de erro técnicas do backend e as transforma em mensagens amigáveis, detectando padrões nas mensagens e mapeando para campos específicos.

## 📋 **Exemplos de Mapeamento**

### **1. Campos Obrigatórios (400 Bad Request)**

**Backend retorna:**
```json
{
  "status": 400,
  "error": {
    "message": "Validation failed: name is required, email is required"
  }
}
```

**Frontend mapeia para:**
- Campo `name`: "Nome é obrigatório"
- Campo `email`: "E-mail é obrigatório"
- Mensagem geral: "Corrija os erros abaixo:"

---

### **2. Email Já Cadastrado (409 Conflict)**

**Backend retorna:**
```json
{
  "status": 409,
  "error": {
    "message": "Email already exists in database"
  }
}
```

**Frontend mapeia para:**
- Campo `email`: "Este e-mail já está cadastrado"
- Mensagem geral: "Dados já cadastrados no sistema."

---

### **3. ISBN Duplicado (409 Conflict)**

**Backend retorna:**
```json
{
  "status": 409,
  "error": {
    "message": "Unique constraint violation: isbn already exists"
  }
}
```

**Frontend mapeia para:**
- Campo `isbn`: "Este ISBN já está sendo usado em outro livro"
- Mensagem geral: "Dados já cadastrados no sistema."

---

### **4. Credenciais Inválidas (401 Unauthorized)**

**Backend retorna:**
```json
{
  "status": 401,
  "error": {
    "message": "Invalid password or credentials"
  }
}
```

**Frontend mapeia para:**
- Campo `email`: "Verifique suas credenciais"
- Campo `password`: "Verifique suas credenciais"
- Mensagem geral: "E-mail ou senha incorretos"

---

### **5. Validação de Tamanho (400 Bad Request)**

**Backend retorna:**
```json
{
  "status": 400,
  "error": {
    "message": "Password must be at least 6 characters long"
  }
}
```

**Frontend mapeia para:**
- Campo `password`: "Senha deve ter pelo menos 6 caracteres"
- Mensagem geral: "Corrija os erros abaixo:"

---

### **6. Email Inválido (400 Bad Request)**

**Backend retorna:**
```json
{
  "status": 400,
  "error": {
    "message": "Invalid email format provided"
  }
}
```

**Frontend mapeia para:**
- Campo `email`: "Formato de e-mail inválido"
- Mensagem geral: "Corrija os erros abaixo:"

---

## 🔍 **Palavras-chave Detectadas**

### **Campos Obrigatórios:**
- `required`, `obrigatório`, `not null`, `cannot be null`, `is required`

### **Violação de Unicidade:**
- `unique`, `exists`, `duplicate`, `already exists`, `já existe`, `constraint`

### **Credenciais Inválidas:**
- `password`, `credential`, `login`, `auth`, `invalid`

### **Validações de Tamanho:**
- `min`, `minimum`, `at least`, `pelo menos`
- `max`, `maximum`, `no more than`, `máximo`

### **Formato Inválido:**
- `invalid`, `format`, `inválido`, `formato`

---

## 🛠 **Estruturas de Erro Suportadas**

O serviço consegue extrair mensagens de diferentes estruturas:

```javascript
// Estrutura 1: Objeto com message
{ error: { message: "Email is required" } }

// Estrutura 2: String direta
{ error: "Title cannot be null" }

// Estrutura 3: Objeto com error
{ error: { error: "ISBN already exists" } }

// Estrutura 4: Objeto com details
{ error: { details: "Password must be at least 6 characters" } }
```

---

## 📱 **Como Usar nos Componentes**

```typescript
// No componente
constructor(private errorMapper: ErrorMapperService) {}

onSubmit() {
  this.service.create(data).subscribe({
    error: (error) => {
      const mappedError = this.errorMapper.mapError(error);
      this.showMessage(mappedError.message, 'error');
      this.mappedError = mappedError; // Para usar nos campos
    }
  });
}

// Nos métodos de validação
getFieldError(fieldName: string): string {
  if (this.mappedError) {
    return this.errorMapper.getFieldError(this.mappedError, fieldName);
  }
  return '';
}

isFieldInvalid(fieldName: string): boolean {
  if (this.mappedError) {
    return this.errorMapper.hasFieldError(this.mappedError, fieldName);
  }
  return false;
}
```

---

## ✅ **Vantagens**

1. **Zero modificações no backend** - Funciona com qualquer API
2. **Detecção inteligente** - Analisa padrões nas mensagens
3. **Mensagens amigáveis** - Traduz termos técnicos
4. **Mapeamento por campo** - Destaca campos específicos
5. **Extensível** - Fácil adicionar novos padrões
6. **Multilíngue** - Suporta português e inglês
7. **Flexível** - Funciona com diferentes estruturas de erro