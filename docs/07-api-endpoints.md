# 🔌 API Endpoints

## Base URL

**Desenvolvimento:** `http://localhost:3000`
**Produção:** `https://api.seudominio.com`

---

## Autenticação

A maioria dos endpoints requer autenticação via JWT Bearer Token.

### Header de Autenticação
```http
Authorization: Bearer {token}
```

---

## 1. Autenticação (`/auth`)

### 1.1 Registro de Usuário

**POST** `/auth/register`

Cria uma nova conta de usuário.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha_segura123",
  "name": "Nome do Usuário"
}
```

**Response:** `201 Created`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "role": "user"
  }
}
```

**Erros:**
- `400 Bad Request`: Email já cadastrado ou dados inválidos
- `422 Unprocessable Entity`: Validação falhou

---

### 1.2 Login

**POST** `/auth/login`

Autentica um usuário e retorna token JWT.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha_segura123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "role": "user"
  }
}
```

**Erros:**
- `401 Unauthorized`: Credenciais inválidas
- `401 Unauthorized`: Usuário inativo

---

## 2. Briefings (`/briefings`)

### 2.1 Criar Briefing

**POST** `/briefings`

Cria um novo briefing contábil.

**Auth:** Opcional (pode ser usado sem autenticação)

**Request Body:**
```json
{
  "dadosGerais": {
    "nomeCliente": "João da Silva",
    "cpfCnpj": "123.456.789-00",
    "email": "joao@exemplo.com",
    "telefone": "(11) 98765-4321",
    "finalidade": "abertura"
  },
  "tipoEntidade": "limitada",
  "entidadeNome": "Empresa Exemplo LTDA",
  "endereco": {
    "logradouro": "Rua Exemplo",
    "numero": "123",
    "complemento": "Sala 456",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "uf": "SP",
    "cep": "01234567",
    "tipoImovel": "proprio"
  },
  "objetoSocial": "Prestação de serviços de consultoria...",
  "faturamentoEstimado": "360k-4.8mi",
  "inscricoes": {
    "estadual": false,
    "municipal": true,
    "especial": false
  },
  "socios": [
    {
      "tipo": "pf",
      "nome": "João da Silva",
      "cpfCnpj": "123.456.789-00",
      "rg": "12.345.678-9",
      "estadoCivil": "casado",
      "regimeBens": "comunhao-parcial",
      "endereco": "Rua ABC, 123",
      "email": "joao@exemplo.com",
      "telefone": "(11) 98765-4321",
      "participacao": "70.00",
      "administrador": true,
      "restricoes": "nao"
    },
    {
      "tipo": "pf",
      "nome": "Maria Santos",
      "cpfCnpj": "987.654.321-00",
      "participacao": "30.00",
      "administrador": false,
      "restricoes": "nao"
    }
  ],
  "especificos": {
    "capitalSocial": "R$ 100.000,00",
    "formaIntegralizacao": "dinheiro",
    "quorumAlteracoes": "Maioria simples"
  },
  "status": "completo"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-do-briefing",
  "nomeCliente": "João da Silva",
  "tipoEntidade": "limitada",
  "status": "completo",
  "createdAt": "2025-01-14T10:30:00.000Z",
  "socios": [...]
}
```

**Erros:**
- `400 Bad Request`: Dados inválidos
- `422 Unprocessable Entity`: Validação falhou

---

### 2.2 Listar Briefings

**GET** `/briefings`

Lista briefings com filtros e paginação.

**Auth:** Opcional

**Query Parameters:**
| Parâmetro     | Tipo   | Descrição                          | Exemplo            |
|---------------|--------|------------------------------------|--------------------|
| search        | string | Busca por nome/CNPJ               | `?search=empresa`  |
| tipoEntidade  | string | Filtrar por tipo                  | `?tipoEntidade=sa` |
| status        | string | Filtrar por status                | `?status=completo` |
| finalidade    | string | Filtrar por finalidade            | `?finalidade=abertura` |
| dataInicio    | date   | Data inicial                      | `?dataInicio=2025-01-01` |
| dataFim       | date   | Data final                        | `?dataFim=2025-12-31` |
| userId        | uuid   | Filtrar por usuário               | `?userId=uuid` |
| orderBy       | string | Campo de ordenação                | `?orderBy=createdAt` |
| order         | string | Direção (ASC/DESC)                | `?order=DESC` |
| page          | number | Número da página                  | `?page=1` |
| limit         | number | Itens por página                  | `?limit=10` |

**Exemplo:**
```
GET /briefings?search=empresa&tipoEntidade=limitada&status=completo&page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid-1",
      "nomeCliente": "João da Silva",
      "cpfCnpj": "123.456.789-00",
      "email": "joao@exemplo.com",
      "tipoEntidade": "limitada",
      "entidadeNome": "Empresa Exemplo LTDA",
      "status": "completo",
      "endereco": {
        "cidade": "São Paulo",
        "uf": "SP"
      },
      "socios": [
        {
          "nome": "João da Silva",
          "participacao": "70.00"
        }
      ],
      "createdAt": "2025-01-14T10:30:00.000Z"
    }
  ],
  "total": 42
}
```

---

### 2.3 Buscar Briefing por ID

**GET** `/briefings/:id`

Retorna um briefing específico com todos os detalhes.

**Auth:** Opcional

**Response:** `200 OK`
```json
{
  "id": "uuid-do-briefing",
  "nomeCliente": "João da Silva",
  "cpfCnpj": "123.456.789-00",
  "email": "joao@exemplo.com",
  "telefone": "(11) 98765-4321",
  "finalidade": "abertura",
  "tipoEntidade": "limitada",
  "entidadeNome": "Empresa Exemplo LTDA",
  "endereco": {
    "logradouro": "Rua Exemplo",
    "numero": "123",
    "complemento": "Sala 456",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "uf": "SP",
    "cep": "01234567",
    "tipoImovel": "proprio"
  },
  "objetoSocial": "Prestação de serviços...",
  "faturamentoEstimado": "360k-4.8mi",
  "inscricoes": {
    "estadual": false,
    "municipal": true,
    "especial": false
  },
  "socios": [
    {
      "id": "uuid-socio-1",
      "tipo": "pf",
      "nome": "João da Silva",
      "cpfCnpj": "123.456.789-00",
      "participacao": "70.00",
      "administrador": true
    }
  ],
  "especificos": {
    "capitalSocial": "R$ 100.000,00"
  },
  "status": "completo",
  "user": {
    "id": "uuid-usuario",
    "name": "Nome do Usuário"
  },
  "createdAt": "2025-01-14T10:30:00.000Z",
  "updatedAt": "2025-01-14T10:30:00.000Z"
}
```

**Erros:**
- `404 Not Found`: Briefing não encontrado

---

### 2.4 Atualizar Briefing

**PATCH** `/briefings/:id`

Atualiza um briefing existente (parcialmente).

**Auth:** Opcional

**Request Body:**
```json
{
  "status": "em_analise",
  "entidadeNome": "Novo Nome LTDA",
  "socios": [...]
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid-do-briefing",
  "status": "em_analise",
  "entidadeNome": "Novo Nome LTDA",
  "updatedAt": "2025-01-14T11:00:00.000Z"
}
```

**Erros:**
- `404 Not Found`: Briefing não encontrado
- `400 Bad Request`: Dados inválidos

---

### 2.5 Deletar Briefing

**DELETE** `/briefings/:id`

Remove um briefing e todos os sócios associados.

**Auth:** Obrigatória (JWT)

**Response:** `204 No Content`

**Erros:**
- `404 Not Found`: Briefing não encontrado
- `401 Unauthorized`: Token inválido ou ausente

---

### 2.6 Estatísticas

**GET** `/briefings/statistics`

Retorna estatísticas agregadas para dashboard.

**Auth:** Obrigatória (JWT)

**Response:** `200 OK`
```json
{
  "total": 150,
  "porTipo": [
    { "tipo": "limitada", "count": "65" },
    { "tipo": "sa", "count": "30" },
    { "tipo": "holding", "count": "25" },
    { "tipo": "associacao", "count": "20" },
    { "tipo": "spe", "count": "10" }
  ],
  "porStatus": [
    { "status": "completo", "count": "80" },
    { "status": "rascunho", "count": "40" },
    { "status": "em_analise", "count": "20" },
    { "status": "aprovado", "count": "10" }
  ],
  "porFinalidade": [
    { "finalidade": "abertura", "count": "100" },
    { "finalidade": "regularizacao", "count": "30" },
    { "finalidade": "viabilidade", "count": "20" }
  ],
  "porMes": [
    { "mes": "2025-01", "count": "25" },
    { "mes": "2024-12", "count": "30" },
    { "mes": "2024-11", "count": "20" }
  ],
  "recentes": [
    {
      "id": "uuid-1",
      "nomeCliente": "Cliente Recente",
      "tipoEntidade": "limitada",
      "createdAt": "2025-01-14T10:00:00.000Z"
    }
  ]
}
```

---

### 2.7 Exportar para Excel

**GET** `/briefings/export/excel`

Exporta briefings filtrados para formato Excel (.xlsx).

**Auth:** Obrigatória (JWT)

**Query Parameters:** Mesmos de listar briefings

**Response:** `200 OK`
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="briefings.xlsx"

[Binary Excel File]
```

---

### 2.8 Exportar para CSV

**GET** `/briefings/export/csv`

Exporta briefings filtrados para formato CSV.

**Auth:** Obrigatória (JWT)

**Query Parameters:** Mesmos de listar briefings

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename="briefings.csv"

ID,Nome do Cliente,CPF/CNPJ,Email,Telefone,...
uuid-1,"João da Silva","123.456.789-00","joao@exemplo.com",...
```

---

## 3. Usuários (`/users`)

### 3.1 Listar Usuários

**GET** `/users`

Lista todos os usuários.

**Auth:** Obrigatória (JWT - Admin)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-1",
    "email": "admin@exemplo.com",
    "name": "Administrador",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### 3.2 Buscar Usuário por ID

**GET** `/users/:id`

Retorna detalhes de um usuário.

**Auth:** Obrigatória (JWT)

**Response:** `200 OK`
```json
{
  "id": "uuid-usuario",
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "role": "user",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "briefings": []
}
```

---

### 3.3 Atualizar Usuário

**PATCH** `/users/:id`

Atualiza dados de um usuário.

**Auth:** Obrigatória (JWT - próprio usuário ou Admin)

**Request Body:**
```json
{
  "name": "Novo Nome",
  "email": "novoemail@exemplo.com"
}
```

**Response:** `200 OK`

---

### 3.4 Deletar Usuário

**DELETE** `/users/:id`

Remove um usuário do sistema.

**Auth:** Obrigatória (JWT - Admin)

**Response:** `204 No Content`

---

## 4. Códigos de Status HTTP

| Código | Descrição                        | Uso                                    |
|--------|----------------------------------|----------------------------------------|
| 200    | OK                               | Requisição bem-sucedida                |
| 201    | Created                          | Recurso criado com sucesso             |
| 204    | No Content                       | Requisição bem-sucedida, sem resposta  |
| 400    | Bad Request                      | Dados inválidos ou malformados         |
| 401    | Unauthorized                     | Não autenticado ou token inválido      |
| 403    | Forbidden                        | Sem permissão para acessar recurso     |
| 404    | Not Found                        | Recurso não encontrado                 |
| 422    | Unprocessable Entity             | Validação falhou                       |
| 500    | Internal Server Error            | Erro interno do servidor               |

---

## 5. Tratamento de Erros

### Estrutura de Erro Padrão

```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "error": "Bad Request",
  "timestamp": "2025-01-14T10:00:00.000Z",
  "path": "/briefings"
}
```

### Exemplo de Erro de Validação

```json
{
  "statusCode": 422,
  "message": [
    "email must be an email",
    "cpfCnpj must be a valid CPF or CNPJ",
    "participacao must not be greater than 100"
  ],
  "error": "Unprocessable Entity"
}
```

---

## 6. Rate Limiting (Futuro)

Proteção contra abuso de API:

```
Rate Limit: 100 requests por minuto
```

**Headers de Resposta:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

**Erro ao exceder:**
```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "retryAfter": 60
}
```

---

## 7. Exemplos de Uso (cURL)

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

### Criar Briefing
```bash
curl -X POST http://localhost:3000/briefings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d @briefing.json
```

### Listar com Filtros
```bash
curl -X GET "http://localhost:3000/briefings?tipoEntidade=limitada&status=completo&page=1&limit=10" \
  -H "Authorization: Bearer {token}"
```

### Exportar Excel
```bash
curl -X GET "http://localhost:3000/briefings/export/excel?status=completo" \
  -H "Authorization: Bearer {token}" \
  --output briefings.xlsx
```

---

## 8. Postman Collection

Importe a collection Postman para facilitar testes:

```json
{
  "info": {
    "name": "Briefing Contábil API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [...]
}
```

**Download:** [briefing-api.postman_collection.json](./postman/briefing-api.postman_collection.json)

---

**Última atualização:** 2025-01-14
