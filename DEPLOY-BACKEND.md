# 🚀 Guia de Deploy do Backend

## ⚠️ Importante: Vercel vs Backend

A **Vercel hospeda apenas o frontend** (HTML/CSS/JS estático).

Para ter um sistema completo funcionando, você precisa:
- ✅ Frontend na Vercel (já deployado)
- ❌ Backend em outra plataforma
- ❌ Banco de dados PostgreSQL

---

## 📋 Opções de Deploy

### **Opção 1: Railway (Recomendado - Mais Fácil)**

✅ **Vantagens:**
- Deploy automático do GitHub
- PostgreSQL incluído gratuitamente
- Fácil configuração
- $5/mês de crédito grátis

**Passo a passo:**

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione `luizcarlosamorim/briefing-contabil`
5. Configure as variáveis de ambiente:
   ```env
   DATABASE_HOST=<será preenchido automaticamente>
   DATABASE_PORT=5432
   DATABASE_USER=<será preenchido automaticamente>
   DATABASE_PASSWORD=<será preenchido automaticamente>
   DATABASE_NAME=railway
   JWT_SECRET=seu_secret_super_seguro_mude_isso_agora
   JWT_EXPIRES_IN=7d
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://seu-site.vercel.app
   INFOSIMPLES_TOKEN=Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6
   ```
6. Adicione um banco PostgreSQL:
   - Clique em "New" → "Database" → "Add PostgreSQL"
   - O Railway conectará automaticamente
7. Configure o Root Directory:
   - Settings → Root Directory: `backend`
8. Após deploy, copie a URL pública (ex: `https://seu-backend.railway.app`)

---

### **Opção 2: Render**

✅ **Vantagens:**
- Plano gratuito disponível
- PostgreSQL incluído no gratuito
- Deploy automático

**Passo a passo:**

1. Acesse https://render.com
2. Conecte sua conta GitHub
3. Crie um novo Web Service:
   - Repository: `luizcarlosamorim/briefing-contabil`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
4. Crie um PostgreSQL Database (gratuito)
5. Configure as variáveis de ambiente (igual Railway)
6. Conecte o banco ao Web Service

---

### **Opção 3: Heroku**

✅ **Vantagens:**
- Tradicional e estável
- Boa documentação

❌ **Desvantagens:**
- Não tem plano gratuito mais

**Passo a passo:**

1. Instale Heroku CLI: `npm install -g heroku`
2. Faça login: `heroku login`
3. Crie app:
   ```bash
   cd backend
   heroku create seu-briefing-backend
   heroku addons:create heroku-postgresql:mini
   ```
4. Configure variáveis:
   ```bash
   heroku config:set JWT_SECRET=seu_secret
   heroku config:set CORS_ORIGIN=https://seu-site.vercel.app
   heroku config:set INFOSIMPLES_TOKEN=seu_token
   ```
5. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

## 🔧 Configurar Frontend para usar Backend

Depois de fazer deploy do backend, você precisa configurar a Vercel:

### 1. Acesse o Dashboard da Vercel

https://vercel.com/seu-usuario/briefing-contabil

### 2. Vá em Settings → Environment Variables

Adicione:

```env
VITE_API_URL=https://seu-backend.railway.app/api
VITE_INFOSIMPLES_TOKEN=Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6
```

### 3. Redeploy

- Vá em Deployments → Three dots → Redeploy

---

## 🎯 Opção Temporária: Apenas Frontend

Se quiser testar só o frontend (sem backend):

1. **Configure na Vercel:**
   ```env
   VITE_API_URL=
   VITE_INFOSIMPLES_TOKEN=Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6
   ```

2. **Funcionalidades disponíveis:**
   - ✅ Formulário de briefing
   - ✅ Consulta CNPJ (via Infosimples)
   - ✅ Consulta CEP
   - ✅ Salvamento local no navegador
   - ❌ Salvar no banco de dados
   - ❌ Dashboard admin
   - ❌ Login/autenticação

---

## 📊 Comparação de Custos

| Plataforma | Plano Gratuito | Custo Mensal | PostgreSQL |
|------------|----------------|--------------|------------|
| Railway    | $5 crédito     | $5-20        | ✅ Incluído |
| Render     | ✅ Sim (limitado) | $0-7      | ✅ Incluído |
| Heroku     | ❌ Não         | $7+          | ✅ Add-on   |
| Vercel     | ✅ Frontend    | $0           | ❌ Não tem  |

---

## 🆘 Precisa de Ajuda?

Escolha uma opção e me avise qual você prefere. Posso ajudar com:
- Configuração específica de cada plataforma
- Troubleshooting de erros
- Otimização de deploy
