# 🗄️ Configuração do Supabase - Passo a Passo

## ✅ O que você precisa fazer:

Você já criou o projeto no Supabase e forneceu as credenciais. Agora falta apenas:
1. **Criar as tabelas** no banco de dados
2. **Configurar variáveis** na Vercel
3. **(Opcional)** Criar usuário admin

---

## 📋 Passo 1: Criar as Tabelas

### 1.1 Acesse o SQL Editor do Supabase:
1. Abra: https://supabase.com/dashboard
2. Selecione seu projeto: **briefing-contabil**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**

### 1.2 Cole o SQL abaixo:

```sql
-- ============================================
-- SUPABASE - Schema do Banco de Dados
-- ============================================

-- Extensão para UUID (já vem ativa no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tabela: briefings
-- ============================================
CREATE TABLE IF NOT EXISTS briefings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo TEXT UNIQUE NOT NULL,
  nome_cliente TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  finalidade TEXT NOT NULL,
  tipo_entidade TEXT NOT NULL,
  entidade_nome TEXT NOT NULL,
  objeto_social TEXT,
  faturamento_estimado TEXT,
  capital_social TEXT,
  total_quotas TEXT,
  endereco JSONB NOT NULL DEFAULT '{}',
  inscricoes JSONB NOT NULL DEFAULT '{"estadual": false, "municipal": false, "especial": false}',
  socios JSONB DEFAULT '[]',
  documentos JSONB DEFAULT '[]',
  especificos JSONB DEFAULT '{}',
  status TEXT DEFAULT 'completo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_briefings_protocolo ON briefings(protocolo);
CREATE INDEX IF NOT EXISTS idx_briefings_cpf_cnpj ON briefings(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_briefings_email ON briefings(email);
CREATE INDEX IF NOT EXISTS idx_briefings_created_at ON briefings(created_at DESC);

-- ============================================
-- Tabela: profiles (perfis de usuários)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Trigger: Atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_briefings_updated_at ON briefings;
CREATE TRIGGER update_briefings_updated_at
  BEFORE UPDATE ON briefings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Trigger: Criar perfil ao criar usuário
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Row Level Security (RLS) - Segurança
-- ============================================
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode criar briefings (formulário público)
CREATE POLICY "Qualquer um pode criar briefings"
  ON briefings FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Qualquer um pode ver briefings
CREATE POLICY "Qualquer um pode ver briefings"
  ON briefings FOR SELECT TO anon, authenticated USING (true);

-- Apenas autenticados podem atualizar/deletar
CREATE POLICY "Autenticados podem atualizar briefings"
  ON briefings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Autenticados podem deletar briefings"
  ON briefings FOR DELETE TO authenticated USING (true);

-- Perfis
CREATE POLICY "Ver próprio perfil"
  ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Atualizar próprio perfil"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
```

### 1.3 Execute o SQL:
- Clique no botão **Run** (ou pressione `Ctrl+Enter`)
- Deve aparecer: **Success. No rows returned**

---

## 🌐 Passo 2: Configurar Variáveis na Vercel

### 2.1 Acesse seu projeto na Vercel:
1. Abra: https://vercel.com/dashboard
2. Clique no seu projeto: **briefing-contabil**
3. Vá em **Settings** → **Environment Variables**

### 2.2 Adicione estas variáveis:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://dqspsuukymbwimyfcryh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxc3BzdXVreW1id2lteWZjcnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDE1MTIsImV4cCI6MjA3OTMxNzUxMn0.6lVG6F8nhTBM6AsTCD7oxSgqehU73rLyyS7S3LZ-3N0` |
| `VITE_INFOSIMPLES_TOKEN` | `Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6` |

### 2.3 Redeploy o projeto:
1. Vá em **Deployments**
2. Clique nos **três pontos** do último deploy
3. Clique em **Redeploy**
4. Aguarde o build completar

---

## 👤 Passo 3: Criar Usuário Admin (Opcional)

Se quiser acessar o painel administrativo:

### 3.1 No Supabase Dashboard:
1. Vá em **Authentication** (menu lateral)
2. Clique em **Users**
3. Clique em **Add User** → **Create New User**
4. Preencha:
   - Email: `admin@admin.com`
   - Password: `admin123`
5. Clique em **Create User**

### 3.2 Definir como Admin:
No SQL Editor, execute:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@admin.com';
```

---

## ✅ Passo 4: Testar o Sistema

### 4.1 Teste o formulário público:
1. Acesse: `https://seu-site.vercel.app`
2. Preencha o formulário
3. Clique em **Finalizar e Gerar Protocolo**
4. Deve gerar um protocolo tipo `BRF-20251121-XXXX`

### 4.2 Teste o admin (se criou usuário):
1. Acesse: `https://seu-site.vercel.app/admin`
2. Login com `admin@admin.com` / `admin123`
3. Deve mostrar o briefing que você criou

### 4.3 Verificar no Supabase:
1. Vá em **Table Editor** no Supabase
2. Clique na tabela **briefings**
3. Deve mostrar o briefing salvo

---

## 🐛 Troubleshooting

### Erro: "relation briefings does not exist"
→ Execute o SQL do Passo 1 novamente

### Erro: "permission denied for table briefings"
→ As políticas RLS não foram criadas. Execute o SQL completo.

### Erro: "Failed to fetch" no frontend
→ Verifique se as variáveis de ambiente estão corretas na Vercel

### Login não funciona
→ Verifique se criou o usuário no Authentication do Supabase

---

## 📊 Arquitetura Final

```
┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │   Supabase      │
│   (Frontend)    │ ←→  │   (Backend)     │
│                 │     │                 │
│   React + Vite  │     │   PostgreSQL    │
│   Tailwind CSS  │     │   Auth          │
│                 │     │   Storage       │
└─────────────────┘     └─────────────────┘
```

**Vantagens:**
- ✅ 100% Grátis
- ✅ Sem servidor para gerenciar
- ✅ Auto-scaling
- ✅ HTTPS incluído
- ✅ PostgreSQL real (não NoSQL)

---

## 📝 Credenciais do Projeto

**Supabase:**
- URL: `https://dqspsuukymbwimyfcryh.supabase.co`
- Project Ref: `dqspsuukymbwimyfcryh`
- Região: (verificar no dashboard)

**Vercel:**
- Verificar URL do deploy no dashboard da Vercel

---

## 🔒 Segurança

- A chave `anon` é pública e pode ser exposta no frontend
- Ela só permite o que as políticas RLS permitem
- Para operações sensíveis, use a chave `service_role` (apenas no servidor)

---

**Pronto!** Seu sistema está funcionando com Vercel + Supabase.
