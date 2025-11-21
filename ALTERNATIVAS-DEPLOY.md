# 🔄 Alternativas de Deploy - Vercel vs Backend

## ❌ Por que Backend NestJS não funciona na Vercel?

### Limitações da Vercel:

1. **Serverless Functions** (não servidores persistentes)
   - Cada requisição inicia/para uma função
   - Timeout de **10 segundos máximo**
   - Não mantém conexões abertas

2. **NestJS é Stateful**
   - Precisa rodar constantemente
   - Mantém pool de conexões do banco
   - TypeORM precisa de servidor persistente

3. **Custo Proibitivo**
   - Vercel cobra por tempo de execução
   - Backend rodando = custo alto
   - Não é feito para isso

### ✅ O que a Vercel faz bem:
- Frontend estático (React, Next.js, Vue)
- API Routes do Next.js (pequenas functions)
- Edge Functions (lógica simples)

---

## 🎯 Alternativas SEM PostgreSQL Separado

### **Opção 1: Supabase (RECOMENDADO - 100% Grátis)**

✅ **Vantagens:**
- PostgreSQL grátis (500MB)
- Autenticação incluída
- Storage de arquivos incluído
- API REST automática
- Realtime subscriptions
- SDK JavaScript/TypeScript

**Como funciona:**
```
Frontend (Vercel) → Supabase API → PostgreSQL (Supabase)
```

**Implementação:**
1. Criar conta no Supabase: https://supabase.com
2. Criar novo projeto
3. Usar o SDK do Supabase no frontend
4. **NÃO precisa de backend NestJS!**

**Código exemplo:**
```javascript
// Frontend direto
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://seu-projeto.supabase.co',
  'sua-chave-publica'
)

// Salvar briefing
const { data, error } = await supabase
  .from('briefings')
  .insert({
    nomeCliente: 'João Silva',
    cpfCnpj: '123.456.789-00',
    // ... outros campos
  })
```

**Custo:** $0 (grátis até 500MB + 2GB transfer)

---

### **Opção 2: Vercel Postgres + Next.js API Routes**

✅ **Vantagens:**
- Tudo na Vercel (um lugar só)
- PostgreSQL serverless
- Integração nativa

❌ **Limitações:**
- Precisa reescrever backend como API Routes
- Não gratuito (depois dos primeiros dias)
- 10s timeout por função

**Como funciona:**
```
Frontend (Vercel) → API Routes (Vercel) → Vercel Postgres
```

**Estrutura:**
```
pages/
  api/
    briefings/
      index.js     // GET, POST /api/briefings
      [id].js      // GET, PUT, DELETE /api/briefings/[id]
    auth/
      login.js     // POST /api/auth/login
```

**Custo:** $20/mês (Vercel Pro) + Postgres

---

### **Opção 3: Firebase/Firestore (NoSQL)**

✅ **Vantagens:**
- Grátis generoso
- NoSQL (sem migrations)
- Autenticação incluída
- Realtime
- Offline support

❌ **Desvantagens:**
- NoSQL (diferente de SQL)
- Precisa reescrever lógica
- Lock-in no Google

**Como funciona:**
```
Frontend (Vercel) → Firebase SDK → Firestore (Google)
```

**Código exemplo:**
```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const db = getFirestore(app)

// Salvar briefing
await addDoc(collection(db, 'briefings'), {
  nomeCliente: 'João Silva',
  cpfCnpj: '123.456.789-00',
  createdAt: new Date()
})
```

**Custo:** $0 (grátis até 1GB storage + 50K leituras/dia)

---

### **Opção 4: Vercel KV (Redis)**

✅ **Vantagens:**
- Integração nativa Vercel
- Super rápido (in-memory)
- Serverless

❌ **Limitações:**
- Key-Value store (não relacional)
- Não é ideal para dados complexos
- Limite de 256MB grátis

**Melhor para:**
- Cache
- Sessions
- Rate limiting
- Não para dados primários

**Custo:** $0 (256MB) → $20/mês (1GB)

---

## 🏆 Comparação: Qual escolher?

| Solução | Custo | Complexidade | PostgreSQL | Ideal Para |
|---------|-------|--------------|------------|------------|
| **Supabase** | 💚 Grátis | 🟢 Baixa | ✅ Sim | **Projetos novos** |
| **Railway** | 💛 $5-10/mês | 🟡 Média | ✅ Sim | **Backend NestJS** |
| Vercel Postgres | 🔴 $20+/mês | 🔴 Alta | ✅ Sim (serverless) | Quem já paga Vercel |
| Firebase | 💚 Grátis | 🟢 Baixa | ❌ NoSQL | Apps realtime |
| Vercel KV | 💚 Grátis (limite) | 🟢 Baixa | ❌ Redis | Cache/Sessions |

---

## 🎯 Recomendação por Cenário

### **Cenário 1: Quer grátis e simples**
→ **Use Supabase**
- 100% grátis
- Substitui backend + banco
- SDK fácil de usar

### **Cenário 2: Já tem backend NestJS pronto**
→ **Use Railway** (sua situação atual)
- Backend já está pronto
- Postgres incluído
- $5-10/mês (vale a pena)

### **Cenário 3: Precisa de Realtime**
→ **Use Firebase ou Supabase**
- Updates em tempo real
- Offline support

### **Cenário 4: Tudo na Vercel (caro)**
→ **Vercel Postgres + API Routes**
- Requer reescrita do backend
- $20+/mês

---

## 📝 Como Migrar para Supabase (Frontend-Only)

Se quiser eliminar o backend NestJS:

### Passo 1: Criar Projeto Supabase
```bash
1. https://supabase.com → New Project
2. Nome: briefing-contabil
3. Database Password: (anote isso!)
4. Region: South America (São Paulo)
```

### Passo 2: Criar Tabelas
```sql
-- No Supabase SQL Editor
CREATE TABLE briefings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo TEXT UNIQUE NOT NULL,
  nome_cliente TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  finalidade TEXT NOT NULL,
  tipo_entidade TEXT NOT NULL,
  entidade_nome TEXT NOT NULL,
  endereco JSONB NOT NULL,
  objeto_social TEXT NOT NULL,
  inscricoes JSONB NOT NULL,
  socios JSONB DEFAULT '[]',
  especificos JSONB DEFAULT '{}',
  status TEXT DEFAULT 'completo',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_protocolo ON briefings(protocolo);
CREATE INDEX idx_cpf_cnpj ON briefings(cpf_cnpj);
```

### Passo 3: Instalar SDK
```bash
npm install @supabase/supabase-js
```

### Passo 4: Configurar Frontend
```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Passo 5: Usar no Código
```javascript
// Substituir api.post('/briefings', data)
// Por:
const { data, error } = await supabase
  .from('briefings')
  .insert(briefingData)
  .select()
  .single()

if (error) throw error
return data
```

---

## 💡 Minha Recomendação para Você

**Opção A: Railway (Caminho mais rápido)**
- ✅ Backend já está pronto
- ✅ 15 minutos de configuração
- ✅ $5-10/mês (acessível)
- ✅ Tudo funcionando como está

**Opção B: Supabase (Gratuito, porém requer mudanças)**
- ✅ 100% grátis
- ❌ Precisa adaptar código frontend
- ❌ Remover autenticação atual
- ❌ Reescrever algumas partes
- ⏱️ 2-3 dias de trabalho

---

## ❓ Perguntas Frequentes

**P: Por que não Next.js na Vercel?**
R: Next.js funciona, mas API Routes têm limite de 10s. TypeORM + PostgreSQL precisa de mais tempo.

**P: Posso usar Vercel Functions?**
R: Sim, mas precisa reescrever todo backend como functions independentes. Não vale a pena.

**P: Supabase é seguro?**
R: Sim! Usa PostgreSQL real, Row Level Security (RLS), e é usado por milhares de apps.

**P: Posso migrar de Railway para Supabase depois?**
R: Sim! São apenas bancos PostgreSQL. Pode exportar/importar dados facilmente.

---

## 🎯 Decisão Final

**Para continuar agora:** Use Railway (seu banco já está criado!)
**Para o futuro:** Considere migrar para Supabase se quiser eliminar custos

---

## 📚 Links Úteis

- Supabase: https://supabase.com
- Railway: https://railway.app
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Firebase: https://firebase.google.com
