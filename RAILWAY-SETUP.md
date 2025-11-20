# 🚂 Configuração Railway - Passo a Passo

## 📊 Informações do Banco de Dados

**String de Conexão Completa:**
```
postgresql://postgres:BvrPnHSSmGquwScVGVBZkZfsLCvvItVs@mainline.proxy.rlwy.net:32684/railway
```

**Separado em variáveis:**
```env
DATABASE_HOST=mainline.proxy.rlwy.net
DATABASE_PORT=32684
DATABASE_USER=postgres
DATABASE_PASSWORD=BvrPnHSSmGquwScVGVBZkZfsLCvvItVs
DATABASE_NAME=railway
```

---

## 🚀 Passo 1: Criar o Web Service do Backend

1. **No Railway Dashboard:**
   - Clique em **"New"** → **"GitHub Repo"**
   - Selecione: `luizcarlosamorim/briefing-contabil`
   - Clique em **"Deploy Now"**

2. **Configurar Root Directory:**
   - Clique no serviço criado
   - Vá em **"Settings"** (tab)
   - Role até **"Service Settings"**
   - Em **"Root Directory"**, coloque: `backend`
   - Clique em **"Update"**

3. **Configurar Build Command:**
   - Ainda em Settings
   - Em **"Build Command"**, coloque: `npm install && npm run build`
   - Em **"Start Command"**, coloque: `npm run start:prod`

---

## 🔐 Passo 2: Configurar Variáveis de Ambiente

No Railway, vá em **"Variables"** (tab) e adicione:

```env
# Banco de Dados (já configurado automaticamente)
DATABASE_HOST=mainline.proxy.rlwy.net
DATABASE_PORT=32684
DATABASE_USER=postgres
DATABASE_PASSWORD=BvrPnHSSmGquwScVGVBZkZfsLCvvItVs
DATABASE_NAME=railway

# JWT - Segurança (MUDE ISSO!)
JWT_SECRET=troque_por_uma_senha_super_secreta_aleatoria_aqui_12345
JWT_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=production

# CORS - URL do Frontend na Vercel
CORS_ORIGIN=https://seu-site.vercel.app

# API Infosimples
INFOSIMPLES_TOKEN=Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6
```

**⚠️ IMPORTANTE:**
- Substitua `https://seu-site.vercel.app` pela URL real da Vercel
- Mude o `JWT_SECRET` para algo único e seguro

---

## 🔗 Passo 3: Obter URL Pública do Backend

1. Vá em **"Settings"** do serviço
2. Role até **"Networking"**
3. Clique em **"Generate Domain"**
4. Copie a URL gerada (ex: `https://briefing-backend-production.up.railway.app`)

---

## ☁️ Passo 4: Configurar Vercel

1. Acesse: https://vercel.com/seu-usuario/briefing-contabil
2. Vá em **"Settings"** → **"Environment Variables"**
3. Adicione:

```env
VITE_API_URL=https://briefing-backend-production.up.railway.app/api
VITE_INFOSIMPLES_TOKEN=Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6
```

4. Vá em **"Deployments"**
5. Clique nos **três pontos** do último deployment
6. Clique em **"Redeploy"**
7. Marque **"Use existing Build Cache"**
8. Clique em **"Redeploy"**

---

## 👤 Passo 5: Criar Usuário Admin

Após o backend estar rodando, crie o primeiro usuário admin:

**Opção A: Via Railway CLI**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Executar comando no backend
railway run node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('admin123', 10).then(hash => console.log(hash));
"
```

**Opção B: Via API REST (Mais Fácil)**

Use o Postman ou curl para criar o primeiro usuário:

```bash
curl -X POST https://briefing-backend-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Sistema",
    "email": "admin@admin.com",
    "password": "admin123",
    "role": "admin"
  }'
```

---

## ✅ Passo 6: Testar

1. **Teste o Backend:**
   ```bash
   curl https://briefing-backend-production.up.railway.app/api/health
   ```

   Deve retornar:
   ```json
   {"status":"ok","timestamp":"2025-11-20...","uptime":123}
   ```

2. **Teste o Frontend:**
   - Acesse: `https://seu-site.vercel.app`
   - Tente buscar um CNPJ
   - Deve funcionar sem erros!

3. **Teste o Login Admin:**
   - Acesse: `https://seu-site.vercel.app/admin`
   - Email: `admin@admin.com`
   - Senha: `admin123`

---

## 🐛 Troubleshooting

### Erro: "Backend não responde"
- Verifique os logs no Railway: **"Deployments"** → Clique no deployment → **"View Logs"**
- Verifique se o PORT está configurado como 3001

### Erro: "CORS blocked"
- Verifique se `CORS_ORIGIN` está com a URL correta da Vercel
- A URL não deve ter `/` no final

### Erro: "Database connection failed"
- Verifique as credenciais do banco
- Teste a conexão usando um cliente SQL

---

## 📊 Monitoramento

**Railway Dashboard:**
- **Logs:** Veja erros em tempo real
- **Metrics:** CPU, RAM, Network
- **Usage:** Quanto está consumindo do crédito

**Custos Esperados:**
- Backend: ~$5-10/mês
- PostgreSQL: Incluído (sem custo adicional)
- Total: Cobre com os $5 de crédito grátis inicial

---

## 🎉 Pronto!

Seu sistema está 100% funcionando em produção:

- ✅ Frontend na Vercel
- ✅ Backend no Railway
- ✅ PostgreSQL no Railway
- ✅ HTTPS em tudo
- ✅ Pronto para produção

**URLs:**
- Frontend: https://seu-site.vercel.app
- Backend: https://briefing-backend-production.up.railway.app
- API Docs: https://briefing-backend-production.up.railway.app/api

---

## 📝 Próximos Passos

1. **Segurança:**
   - Mude o `JWT_SECRET` para algo único
   - Configure rate limiting
   - Adicione HTTPS apenas

2. **Domínio Personalizado:**
   - Configure domínio customizado na Vercel
   - Configure domínio do backend no Railway

3. **Monitoramento:**
   - Configure alertas de erro
   - Configure backup do banco

4. **Performance:**
   - Configure CDN
   - Otimize queries do banco
