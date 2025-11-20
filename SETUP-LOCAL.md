# 🚀 Setup Local - Guia Passo a Passo

## ⚡ Quick Start (5 minutos)

### 1. Pré-requisitos

Verifique se você tem instalado:

```bash
node --version  # v18 ou superior
npm --version   # v9 ou superior
```

**Opção A - Com Docker (Recomendado):**
```bash
docker --version
docker-compose --version
```

**Opção B - Sem Docker:**
```bash
psql --version  # PostgreSQL 14 ou superior
```

---

### 2. Instalação Rápida

```bash
# 1. Instale dependências (Frontend)
npm install

# 2. Instale dependências (Backend)
cd backend
npm install
cd ..

# 3. Inicie o banco de dados
docker-compose up -d

# Aguarde 10 segundos para o PostgreSQL iniciar

# 4. Inicie o backend (Terminal 1)
cd backend
npm run start:dev

# 5. Inicie o frontend (Terminal 2)
npm run dev
```

**Acesse:**
- 🎨 Frontend: http://localhost:5173
- ⚙️ Backend: http://localhost:3001/api

---

## 📋 Setup Detalhado

### Passo 1: Clone e Dependências

```bash
# Se ainda não clonou
git clone <seu-repositorio>
cd briefing-vercel

# Instale dependências do frontend
npm install

# Instale dependências do backend
cd backend
npm install
cd ..
```

**Tempo:** ~3 minutos

---

### Passo 2: Configure o Banco de Dados

#### Opção A: Docker Compose (Mais Fácil)

```bash
# Inicie o PostgreSQL
docker-compose up -d

# Verifique se está rodando
docker-compose ps

# Logs (opcional)
docker-compose logs -f postgres
```

**Parar o banco:**
```bash
docker-compose down
```

**Remover dados (reset):**
```bash
docker-compose down -v
```

---

#### Opção B: PostgreSQL Local

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Instale e inicie o serviço

**Criar database:**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Dentro do psql:
CREATE DATABASE briefing_db;
\q
```

---

### Passo 3: Variáveis de Ambiente

Os arquivos já foram criados automaticamente:

**✅ `.env` (Frontend) - Já criado**
```env
VITE_API_URL=http://localhost:3001/api
VITE_INFOSIMPLES_TOKEN=Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6
```

**✅ `backend/.env` - Já criado**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=briefing_db

JWT_SECRET=seu_secret_super_seguro_aqui_troque_em_producao
JWT_EXPIRES_IN=7d

PORT=3001
NODE_ENV=development

CORS_ORIGIN=http://localhost:5173
```

**Se precisar editar:**
```bash
nano backend/.env
```

---

### Passo 4: Inicializar Banco de Dados

**Verificar conexão:**
```bash
cd backend

# Teste a conexão com o banco
psql -h localhost -U postgres -d briefing_db -c "SELECT version();"
```

**Se houver migrations:**
```bash
npm run migration:run
```

**Se NÃO houver migrations:**

O TypeORM vai criar as tabelas automaticamente na primeira execução (synchronize: true em desenvolvimento).

---

### Passo 5: Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Você deve ver:
```
🚀 Backend rodando em: http://localhost:3001
📊 API disponível em: http://localhost:3001/api
```

**Terminal 2 - Frontend:**
```bash
# Na raiz do projeto
npm run dev
```

Você deve ver:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Passo 6: Testar a Aplicação

1. **Abra o navegador:** http://localhost:5173

2. **Teste o formulário:**
   - Preencha "Dados Gerais"
   - Escolha um tipo de entidade
   - Complete o formulário

3. **Teste a busca de CNPJ** (opcional):
   - Selecione finalidade "Regularização"
   - Digite um CNPJ válido
   - Clique em "Buscar"

4. **Teste o login admin** (se configurado):
   - Acesse: http://localhost:5173/admin
   - Use credenciais de teste

---

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Frontend
npm run dev          # Inicia dev server
npm run build        # Build para produção
npm run preview      # Preview da build

# Backend
cd backend
npm run start:dev    # Dev com hot-reload
npm run start:debug  # Dev com debugger
npm run build        # Build TypeScript
npm run start:prod   # Produção (após build)
```

---

### Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -h localhost -U postgres -d briefing_db

# Listar tabelas
\dt

# Ver dados de uma tabela
SELECT * FROM briefings LIMIT 5;

# Sair
\q
```

---

### Docker

```bash
# Iniciar banco
docker-compose up -d

# Parar banco
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar banco
docker-compose restart

# Remover tudo (cuidado!)
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Causa:** PostgreSQL não está rodando

**Solução:**
```bash
# Docker
docker-compose ps

# Se não estiver UP:
docker-compose up -d

# Local
sudo systemctl status postgresql  # Linux
brew services list                 # macOS
```

---

### Erro: "Port 3001 already in use"

**Causa:** Outra aplicação usando a porta

**Solução 1 - Matar processo:**
```bash
# Linux/Mac
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Solução 2 - Mudar porta:**
```bash
# Editar backend/.env
PORT=3002
```

---

### Erro: "Module not found"

**Causa:** Dependências não instaladas

**Solução:**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### Erro: "CORS blocked"

**Causa:** Frontend e Backend em portas diferentes

**Solução:**

Verificar `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

E verificar que o backend está configurado corretamente em `main.ts`.

---

### Frontend carrega mas não conecta ao backend

**Verificar:**

1. Backend está rodando?
```bash
curl http://localhost:3001/api
```

2. URL da API está correta?
```bash
cat .env | grep VITE_API_URL
```

3. Console do navegador (F12) mostra erros?

---

### Banco de dados vazio (sem tabelas)

**Causa:** Migrations não executadas ou synchronize desabilitado

**Solução:**

1. Verificar `backend/src/config/database.config.ts`:
```typescript
synchronize: true  // Deve estar true em dev
```

2. Ou executar migrations:
```bash
cd backend
npm run migration:run
```

---

## 📊 Validação da Instalação

### Checklist

Execute estes comandos para validar:

```bash
# 1. PostgreSQL está rodando?
psql -h localhost -U postgres -d briefing_db -c "SELECT 1"

# 2. Backend responde?
curl http://localhost:3001/api

# 3. Frontend responde?
curl http://localhost:5173

# 4. Variáveis de ambiente OK?
cat .env
cat backend/.env
```

**Todos devem retornar sucesso!**

---

## 🎯 Próximos Passos

Após setup concluído:

1. ✅ Criar usuário admin
2. ✅ Testar todas as funcionalidades
3. ✅ Ler [ANALISE-PROJETO.md](./ANALISE-PROJETO.md)
4. ✅ Implementar melhorias críticas
5. ✅ Preparar para deploy

---

## 📞 Ajuda

**Problemas não resolvidos?**

1. Verifique [ANALISE-PROJETO.md](./ANALISE-PROJETO.md) - Seção Troubleshooting
2. Abra uma issue no repositório
3. Entre em contato: suporte@briefingcontabil.com.br

---

**Instalação bem-sucedida? Bom desenvolvimento! 🚀**
