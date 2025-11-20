# 🗄️ Modelo de Dados

## Diagrama Entidade-Relacionamento (ER)

```
┌─────────────────────────────────────────────────────────────────┐
│                         MODELO DE DADOS                          │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────┐
│         users          │
├────────────────────────┤
│ PK  id (UUID)          │
│ UQ  email              │
│     name               │
│     password (hash)    │
│     role               │◀──────────────┐
│     isActive           │               │
│     createdAt          │               │
│     updatedAt          │               │
└────────────────────────┘               │
           │                             │
           │ 1:N                         │
           │                             │
           ▼                             │
┌────────────────────────┐               │
│      briefings         │               │
├────────────────────────┤               │
│ PK  id (UUID)          │               │
│ FK  userId             │───────────────┘
│                        │
│ ┌──────────────────┐  │
│ │  Dados Gerais    │  │
│ ├──────────────────┤  │
│ │ nomeCliente      │  │
│ │ cpfCnpj          │  │
│ │ email            │  │
│ │ telefone         │  │
│ │ finalidade       │  │
│ └──────────────────┘  │
│                        │
│ ┌──────────────────┐  │
│ │  Entidade        │  │
│ ├──────────────────┤  │
│ │ tipoEntidade     │  │
│ │ entidadeNome     │  │
│ │ endereco (JSONB) │  │
│ │ objetoSocial     │  │
│ │ faturamentoEst.  │  │
│ │ inscricoes(JSONB)│  │
│ └──────────────────┘  │
│                        │
│ ┌──────────────────┐  │
│ │  Específicos     │  │
│ ├──────────────────┤  │
│ │ especificos      │  │
│ │   (JSONB)        │  │
│ └──────────────────┘  │
│                        │
│ ┌──────────────────┐  │
│ │  Controle        │  │
│ ├──────────────────┤  │
│ │ status           │  │
│ │ createdAt        │  │
│ │ updatedAt        │  │
│ └──────────────────┘  │
└────────────────────────┘
           │
           │ 1:N
           │
           ▼
┌────────────────────────┐
│        socios          │
├────────────────────────┤
│ PK  id (UUID)          │
│ FK  briefingId         │◀─┐
│                        │  │ CASCADE DELETE
│     tipo (pf/pj)       │  │
│     nome               │  │
│     cpfCnpj            │  │
│     rg                 │  │
│     estadoCivil        │  │
│     regimeBens         │  │
│     endereco           │  │
│     email              │  │
│     telefone           │  │
│     participacao       │  │
│     administrador      │  │
│     restricoes         │  │
└────────────────────────┘  │
                            │
                            │
┌───────────────────────────┘
│
│ Ao deletar um briefing,
│ todos os sócios são
│ deletados em cascata
```

---

## 1. Entidade: Users

### Estrutura da Tabela

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  isActive BOOLEAN DEFAULT true NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Campos

| Campo     | Tipo         | Descrição                          | Validações                    |
|-----------|--------------|------------------------------------|-------------------------------|
| id        | UUID         | Identificador único                | PK, Auto-gerado              |
| email     | VARCHAR(255) | Email do usuário                   | Único, Email válido          |
| name      | VARCHAR(255) | Nome completo                      | Obrigatório, Min: 3 chars    |
| password  | VARCHAR(255) | Hash bcrypt da senha               | Hash com 10 rounds           |
| role      | VARCHAR(50)  | Perfil de acesso                   | 'admin' ou 'user'            |
| isActive  | BOOLEAN      | Status da conta                    | Default: true                |
| createdAt | TIMESTAMP    | Data de criação                    | Auto-gerado                  |
| updatedAt | TIMESTAMP    | Data da última atualização         | Auto-atualizado              |

### Valores Possíveis

**role:**
- `admin`: Acesso total ao sistema
- `user`: Acesso básico (criar/editar briefings)

---

## 2. Entidade: Briefings

### Estrutura da Tabela

```sql
CREATE TABLE briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Dados Gerais
  nomeCliente VARCHAR(255) NOT NULL,
  cpfCnpj VARCHAR(18) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  finalidade VARCHAR(50) NOT NULL,

  -- Entidade
  tipoEntidade VARCHAR(50) NOT NULL,
  entidadeNome VARCHAR(255) NOT NULL,
  endereco JSONB NOT NULL,
  objetoSocial TEXT NOT NULL,
  faturamentoEstimado VARCHAR(50),
  inscricoes JSONB NOT NULL,

  -- Específicos
  especificos JSONB,

  -- Controle
  status VARCHAR(50) DEFAULT 'rascunho' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_briefings_userId ON briefings(userId);
CREATE INDEX idx_briefings_tipoEntidade ON briefings(tipoEntidade);
CREATE INDEX idx_briefings_status ON briefings(status);
CREATE INDEX idx_briefings_finalidade ON briefings(finalidade);
CREATE INDEX idx_briefings_createdAt ON briefings(createdAt DESC);

-- Índice GIN para JSONB (busca em JSON)
CREATE INDEX idx_briefings_endereco ON briefings USING GIN(endereco);
CREATE INDEX idx_briefings_especificos ON briefings USING GIN(especificos);
```

### Campos Principais

| Campo              | Tipo         | Descrição                     | Validações                    |
|--------------------|--------------|-------------------------------|-------------------------------|
| id                 | UUID         | Identificador único           | PK, Auto-gerado              |
| userId             | UUID         | Referência ao usuário         | FK → users(id), Nullable     |
| nomeCliente        | VARCHAR(255) | Nome/Razão Social cliente     | Obrigatório                  |
| cpfCnpj            | VARCHAR(18)  | CPF ou CNPJ                   | Obrigatório, Validado        |
| email              | VARCHAR(255) | Email de contato              | Obrigatório, Email válido    |
| telefone           | VARCHAR(20)  | Telefone                      | Obrigatório                  |
| finalidade         | VARCHAR(50)  | Tipo de serviço               | Enum (ver abaixo)            |
| tipoEntidade       | VARCHAR(50)  | Tipo de entidade jurídica     | Enum (ver abaixo)            |
| entidadeNome       | VARCHAR(255) | Nome da entidade a constituir | Obrigatório                  |
| endereco           | JSONB        | Endereço completo             | Objeto JSON (ver estrutura)  |
| objetoSocial       | TEXT         | Atividades da entidade        | Obrigatório                  |
| faturamentoEstimado| VARCHAR(50)  | Faixa de faturamento          | Opcional                     |
| inscricoes         | JSONB        | Tipos de inscrição necessária | Objeto JSON (ver estrutura)  |
| especificos        | JSONB        | Dados específicos por tipo    | Objeto JSON variável         |
| status             | VARCHAR(50)  | Status do briefing            | Enum (ver abaixo)            |

### Estruturas JSONB

#### endereco
```json
{
  "logradouro": "Rua Exemplo",
  "numero": "123",
  "complemento": "Sala 456",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "uf": "SP",
  "cep": "01234567",
  "tipoImovel": "proprio"
}
```

**tipoImovel:** `proprio`, `alugado`, `coworking`

#### inscricoes
```json
{
  "estadual": true,
  "municipal": true,
  "especial": false
}
```

#### especificos (varia por tipoEntidade)

**Associação/OSCIP:**
```json
{
  "finalidadePrincipal": "cultural",
  "membrosDiretoria": "5",
  "mandato": "2",
  "conselhoFiscal": true,
  "conselhoDeliberativo": false,
  "remuneracaoDirigentes": false,
  "mensalidade": true
}
```

**SPE:**
```json
{
  "finalidadeProjeto": "Construção de empreendimento...",
  "prazoProjeto": "24 meses",
  "investimentoTotal": "R$ 5.000.000,00",
  "regrasSaida": "Conforme cláusula...",
  "destinoPatrimonio": "Distribuição proporcional..."
}
```

**S.A.:**
```json
{
  "tipoSA": "fechada",
  "capitalSocial": "R$ 1.000.000,00",
  "numeroAcoes": "1000000",
  "classesAcoes": "ordinarias",
  "acordoAcionistas": true,
  "conselhoAdministracao": true
}
```

**Holding:**
```json
{
  "tipoHolding": "pura",
  "objetivoPrincipal": "sucessorio",
  "empresasGrupo": "Empresa A LTDA\nEmpresa B LTDA"
}
```

**LTDA:**
```json
{
  "capitalSocial": "R$ 100.000,00",
  "formaIntegralizacao": "dinheiro",
  "quorumAlteracoes": "Maioria simples (75%)"
}
```

### Enumerações

**finalidade:**
- `abertura`: Abertura de nova entidade
- `regularizacao`: Regularização/Alteração
- `viabilidade`: Estudo de viabilidade

**tipoEntidade:**
- `associacao`: Associação Privada
- `oscip`: OSCIP/ONG
- `spe`: SPE - Sociedade de Propósito Específico
- `sa`: S.A. - Sociedade Anônima
- `holding`: Holding
- `limitada`: Sociedade Limitada (LTDA)
- `simples`: Sociedade Simples

**status:**
- `rascunho`: Em preenchimento
- `completo`: Preenchido completamente
- `em_analise`: Em análise pelo contador
- `aprovado`: Aprovado e em processamento

---

## 3. Entidade: Socios

### Estrutura da Tabela

```sql
CREATE TABLE socios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefingId UUID NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,

  tipo VARCHAR(2) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cpfCnpj VARCHAR(18) NOT NULL,
  rg VARCHAR(20),
  estadoCivil VARCHAR(50),
  regimeBens VARCHAR(100),
  endereco TEXT,
  email VARCHAR(255),
  telefone VARCHAR(20),
  participacao DECIMAL(5,2) NOT NULL,
  administrador BOOLEAN DEFAULT false NOT NULL,
  restricoes VARCHAR(20) DEFAULT 'nao' NOT NULL
);

-- Índices
CREATE INDEX idx_socios_briefingId ON socios(briefingId);
CREATE INDEX idx_socios_tipo ON socios(tipo);
CREATE INDEX idx_socios_administrador ON socios(administrador);

-- Constraint: soma de participação por briefing deve ser 100%
CREATE OR REPLACE FUNCTION check_participacao_total()
RETURNS TRIGGER AS $$
DECLARE
  total DECIMAL(5,2);
BEGIN
  SELECT SUM(participacao) INTO total
  FROM socios
  WHERE briefingId = NEW.briefingId;

  IF total > 100.00 THEN
    RAISE EXCEPTION 'A soma das participações não pode exceder 100%%';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_participacao
  AFTER INSERT OR UPDATE ON socios
  FOR EACH ROW
  EXECUTE FUNCTION check_participacao_total();
```

### Campos

| Campo         | Tipo          | Descrição                      | Validações                    |
|---------------|---------------|--------------------------------|-------------------------------|
| id            | UUID          | Identificador único            | PK, Auto-gerado              |
| briefingId    | UUID          | Referência ao briefing         | FK → briefings(id), CASCADE  |
| tipo          | VARCHAR(2)    | Tipo de pessoa                 | 'pf' ou 'pj'                 |
| nome          | VARCHAR(255)  | Nome completo / Razão Social   | Obrigatório                  |
| cpfCnpj       | VARCHAR(18)   | CPF ou CNPJ                    | Obrigatório, Validado        |
| rg            | VARCHAR(20)   | RG (apenas PF)                 | Opcional                     |
| estadoCivil   | VARCHAR(50)   | Estado civil (apenas PF)       | Enum (ver abaixo)            |
| regimeBens    | VARCHAR(100)  | Regime de bens (se casado)     | Enum (ver abaixo)            |
| endereco      | TEXT          | Endereço completo              | Opcional                     |
| email         | VARCHAR(255)  | Email                          | Opcional, Email válido       |
| telefone      | VARCHAR(20)   | Telefone                       | Opcional                     |
| participacao  | DECIMAL(5,2)  | Percentual de participação     | 0.01 a 100.00                |
| administrador | BOOLEAN       | É administrador da entidade    | Default: false               |
| restricoes    | VARCHAR(20)   | Possui restrições              | 'sim', 'nao', 'nao-sabe'     |

### Enumerações

**tipo:**
- `pf`: Pessoa Física
- `pj`: Pessoa Jurídica

**estadoCivil:**
- `solteiro`: Solteiro(a)
- `casado`: Casado(a)
- `divorciado`: Divorciado(a)
- `viuvo`: Viúvo(a)
- `uniao-estavel`: União Estável

**regimeBens:**
- `comunhao-parcial`: Comunhão Parcial de Bens
- `comunhao-universal`: Comunhão Universal de Bens
- `separacao-total`: Separação Total de Bens
- `participacao-final`: Participação Final nos Aquestos

**restricoes:**
- `nao`: Não possui restrições
- `sim`: Possui restrições
- `nao-sabe`: Não sabe informar

---

## 4. Relacionamentos

### Users ↔ Briefings (1:N)
```
Um usuário pode criar múltiplos briefings
Um briefing pertence a um usuário (ou nenhum)

Cascade: SET NULL (ao deletar usuário, briefings ficam sem dono)
```

### Briefings ↔ Socios (1:N)
```
Um briefing pode ter múltiplos sócios
Um sócio pertence a um único briefing

Cascade: DELETE (ao deletar briefing, sócios são deletados)
```

---

## 5. Constraints e Validações

### Constraints de Banco
```sql
-- Validação de email
ALTER TABLE users ADD CONSTRAINT check_email
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Validação de role
ALTER TABLE users ADD CONSTRAINT check_role
  CHECK (role IN ('admin', 'user'));

-- Validação de status
ALTER TABLE briefings ADD CONSTRAINT check_status
  CHECK (status IN ('rascunho', 'completo', 'em_analise', 'aprovado'));

-- Validação de participação
ALTER TABLE socios ADD CONSTRAINT check_participacao
  CHECK (participacao > 0 AND participacao <= 100);
```

### Índices para Performance
```sql
-- Busca textual rápida
CREATE INDEX idx_briefings_search ON briefings
  USING GIN (to_tsvector('portuguese', nomeCliente || ' ' || entidadeNome));

-- Queries de dashboard
CREATE INDEX idx_briefings_stats ON briefings(tipoEntidade, status, createdAt);

-- Joins frequentes
CREATE INDEX idx_socios_briefing_tipo ON socios(briefingId, tipo);
```

---

## 6. Queries Otimizadas

### Busca com Filtros
```sql
SELECT
  b.id, b.nomeCliente, b.tipoEntidade, b.status,
  b.endereco->>'cidade' as cidade,
  b.endereco->>'uf' as uf,
  COUNT(s.id) as num_socios
FROM briefings b
LEFT JOIN socios s ON s.briefingId = b.id
WHERE
  (b.nomeCliente ILIKE '%busca%' OR b.cpfCnpj ILIKE '%busca%')
  AND b.tipoEntidade = 'limitada'
  AND b.status = 'completo'
  AND b.createdAt BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY b.id
ORDER BY b.createdAt DESC
LIMIT 10 OFFSET 0;
```

### Estatísticas do Dashboard
```sql
-- Total por tipo de entidade
SELECT tipoEntidade, COUNT(*) as total
FROM briefings
GROUP BY tipoEntidade
ORDER BY total DESC;

-- Evolução mensal
SELECT
  TO_CHAR(createdAt, 'YYYY-MM') as mes,
  COUNT(*) as total
FROM briefings
WHERE createdAt >= NOW() - INTERVAL '12 months'
GROUP BY mes
ORDER BY mes DESC;
```

---

## 7. Migrations

### Versionamento
```
migrations/
├── 1704067200000-CreateUsers.ts
├── 1704067300000-CreateBriefings.ts
├── 1704067400000-CreateSocios.ts
├── 1704067500000-AddIndexes.ts
└── 1704067600000-AddConstraints.ts
```

### Exemplo de Migration
```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBriefings1704067300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'briefings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          // ... demais colunas
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('briefings');
  }
}
```

---

**Última atualização:** 2025-01-14
