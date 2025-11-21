# 📊 Sistema de Briefing Contábil

Sistema profissional para coleta e gestão de briefings contábeis.

## 🏗️ Arquitetura

```
┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │   Supabase      │
│   (Frontend)    │ ←→  │   (Backend)     │
│                 │     │                 │
│   React + Vite  │     │   PostgreSQL    │
│   Tailwind CSS  │     │   Auth          │
└─────────────────┘     └─────────────────┘
```

**100% Grátis** - Vercel + Supabase

---

## 🚀 Deploy em Produção (Recomendado)

### Passo 1: Criar tabelas no Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** → **New Query**
4. Cole o SQL de `supabase/schema.sql`
5. Clique em **Run**

### Passo 2: Configurar Vercel
1. Acesse: https://vercel.com/dashboard
2. Seu projeto → **Settings** → **Environment Variables**
3. Adicione:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anon
   - `VITE_INFOSIMPLES_TOKEN` = seu token Infosimples
4. Redeploy o projeto

**Guia completo:** [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)

---

## 💻 Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 3. Iniciar frontend
npm run dev
```

**Acesse:** http://localhost:3000

> **Nota:** Para desenvolvimento local, você precisa ter as tabelas criadas no Supabase.

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [SUPABASE-SETUP.md](./SUPABASE-SETUP.md) | Guia completo de configuração |
| [supabase/schema.sql](./supabase/schema.sql) | SQL para criar tabelas |
| [.env.example](./.env.example) | Template de variáveis |

---

## 🏗️ Estrutura do Projeto

```
briefing-vercel/
├── src/                      # Frontend (React + Vite)
│   ├── App.jsx              # Componente principal
│   ├── admin/               # Dashboard admin
│   ├── pages/               # Páginas (Protocolo)
│   ├── components/          # Componentes React
│   └── services/            #
│       └── supabase.js      # Cliente Supabase
│
├── supabase/                # Configuração Supabase
│   └── schema.sql           # SQL das tabelas
│
├── backend/                 # Backend NestJS (legado)
│   └── ...                  # Não mais necessário
│
├── .env                     # Variáveis locais
├── .env.example             # Template
└── SUPABASE-SETUP.md        # Guia de setup
```

---

## 🛠️ Tecnologias

- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** Supabase (PostgreSQL + Auth + API)
- **Deploy:** Vercel (frontend)
- **Integração:** API Infosimples (CNPJ)

---

## ✅ Status do Projeto

| Feature | Status |
|---------|--------|
| Formulário de Briefing | ✅ Funcionando |
| Consulta CNPJ (Infosimples) | ✅ Funcionando |
| Salvamento no Supabase | ✅ Funcionando |
| Página de Protocolo | ✅ Funcionando |
| Dashboard Admin | ✅ Funcionando |
| Login Admin | ✅ Funcionando |

---

## 🔐 Credenciais de Teste

Após criar usuário no Supabase Authentication:

- **Email:** admin@admin.com
- **Senha:** admin123

---

## 📞 Suporte

- **Issues:** GitHub Issues
- **Email:** suporte@briefingcontabil.com.br

---

**Última atualização:** 2025-11-21
