# ⚡ Guia Rápido

## 🎯 Primeiros Passos

### Para Desenvolvedores

#### 1. Setup do Ambiente (5 minutos)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/briefing-contabil.git
cd briefing-contabil

# Instale dependências do frontend
npm install

# Instale dependências do backend
cd backend
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais
```

#### 2. Configure o Banco de Dados

**Opção A - Docker (Recomendado):**
```bash
docker-compose up -d postgres
```

**Opção B - PostgreSQL Local:**
```bash
# Crie o banco
createdb briefing_db

# Configure no .env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=briefing_db
```

#### 3. Execute Migrations

```bash
cd backend
npm run migration:run
```

#### 4. Inicie os Servidores

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
npm run dev
```

#### 5. Acesse o Sistema

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api (futuro)

---

### Para Usuários Finais

#### Como Preencher um Briefing

1. **Acesse o sistema**
2. **Preencha Dados Gerais**
   - Nome/Razão Social
   - CPF/CNPJ
   - Email e Telefone
   - Escolha finalidade (Abertura/Regularização/Viabilidade)

3. **Use busca CNPJ (opcional)**
   - Para regularização, digite o CNPJ
   - Clique em "Buscar"
   - Confirme preenchimento automático

4. **Selecione Tipo de Entidade**
   - 7 opções disponíveis
   - Escolha conforme objetivo

5. **Complete Dados da Entidade**
   - Nome empresarial
   - Endereço completo
   - Objeto social
   - Inscrições necessárias

6. **Cadastre Sócios**
   - Adicione cada sócio
   - PF ou PJ
   - Participação deve somar 100%

7. **Informações Específicas**
   - Campos adaptativos por tipo
   - Preencha conforme solicitado

8. **Revise e Gere Relatório**
   - Confira todos os dados
   - Clique em "Gerar Relatório"
   - Baixe arquivo TXT

---

## 🔧 Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm run test
npm run test:e2e
npm run test:cov

# Migrations
npm run migration:generate -- src/migrations/NomeDaMigration
npm run migration:run
npm run migration:revert

# Lint
npm run lint
npm run format
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

---

## 📂 Estrutura de Arquivos Importantes

```
briefing-vercel/
├── src/                          # Frontend React
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Entry point
│   ├── admin/
│   │   └── Login.jsx             # Tela de login admin
│   ├── hooks/
│   │   └── useAuth.js            # Hook de autenticação
│   └── services/
│       └── api.js                # Cliente HTTP
│
├── backend/                      # Backend NestJS
│   └── src/
│       ├── app.module.ts         # Módulo raiz
│       ├── main.ts               # Bootstrap
│       ├── auth/                 # Autenticação
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   └── guards/
│       ├── briefings/            # Briefings
│       │   ├── briefing.entity.ts
│       │   ├── socio.entity.ts
│       │   ├── briefings.service.ts
│       │   ├── briefings.controller.ts
│       │   └── export.service.ts
│       ├── users/                # Usuários
│       │   ├── user.entity.ts
│       │   └── users.service.ts
│       └── config/
│           └── database.config.ts
│
├── docs/                         # Documentação
│   ├── README.md                 # Índice geral
│   ├── 00-resumo-executivo.md   # Resumo executivo
│   ├── 01-arquitetura.md        # Arquitetura
│   ├── 04-modelo-dados.md       # Banco de dados
│   ├── 07-api-endpoints.md      # APIs
│   ├── 14-tipos-entidades.md    # Tipos de entidade
│   ├── 17-integracao-infosimples.md  # CNPJ
│   ├── 22-deploy-vercel.md      # Deploy
│   └── 27-roadmap.md            # Roadmap
│
├── .env.example                  # Template de variáveis
├── vercel.json                   # Config Vercel
└── package.json                  # Dependências
```

---

## 🐛 Troubleshooting Rápido

### Erro: "Cannot connect to database"

**Solução:**
```bash
# Verifique se PostgreSQL está rodando
psql -U postgres -c "SELECT version();"

# Verifique variáveis de ambiente
cat backend/.env | grep DATABASE
```

### Erro: "Port 3000 already in use"

**Solução:**
```bash
# Encontre processo usando porta
lsof -i :3000

# Mate o processo
kill -9 [PID]

# Ou use outra porta
PORT=3001 npm run start:dev
```

### Erro: "Module not found"

**Solução:**
```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

### Frontend não carrega depois do build

**Solução:**
```bash
# Verifique vercel.json
# Adicione rota catch-all:
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

## 🔑 Variáveis de Ambiente

### Backend (.env)

```env
# Servidor
NODE_ENV=development
PORT=3000

# Banco de Dados
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=briefing_db

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# API Infosimples (opcional - migrar para backend)
INFOSIMPLES_TOKEN=seu_token_aqui
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_INFOSIMPLES_TOKEN=seu_token_aqui
```

---

## 📊 Tipos de Entidade

| Tipo       | Código      | Uso                                      |
|------------|-------------|------------------------------------------|
| Associação | `associacao`| Entidades sem fins lucrativos            |
| OSCIP      | `oscip`     | ONGs e organizações sociais              |
| SPE        | `spe`       | Projetos específicos                     |
| S.A.       | `sa`        | Sociedades Anônimas                      |
| Holding    | `holding`   | Gestão de participações                  |
| LTDA       | `limitada`  | Sociedades Limitadas (mais comum)       |
| Simples    | `simples`   | Profissionais liberais                   |

---

## 📝 Exemplo de Briefing (JSON)

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
    "bairro": "Centro",
    "cidade": "São Paulo",
    "uf": "SP",
    "cep": "01234567",
    "tipoImovel": "proprio"
  },
  "objetoSocial": "Prestação de serviços de consultoria",
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
      "participacao": "100.00",
      "administrador": true,
      "restricoes": "nao"
    }
  ],
  "especificos": {
    "capitalSocial": "R$ 50.000,00",
    "formaIntegralizacao": "dinheiro"
  }
}
```

---

## 🚀 Deploy Rápido

### Vercel (Frontend)

```bash
# Instale CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Produção
vercel --prod
```

### Railway (Backend)

```bash
# Instale CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

---

## 📞 Onde Buscar Ajuda

### Documentação
- **Técnica**: [docs/README.md](./README.md)
- **API**: [docs/07-api-endpoints.md](./07-api-endpoints.md)
- **Deploy**: [docs/22-deploy-vercel.md](./22-deploy-vercel.md)

### Suporte
- **Email**: suporte@briefingcontabil.com.br
- **Issues**: https://github.com/seu-usuario/briefing-contabil/issues
- **Discussions**: https://github.com/seu-usuario/briefing-contabil/discussions

### Comunidade
- **Discord**: Em breve
- **Telegram**: Em breve

---

## 📚 Recursos Adicionais

### Tecnologias
- [React Docs](https://react.dev)
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Vite Docs](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)

### APIs
- [Infosimples API](https://api.infosimples.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

**🎉 Pronto! Você está preparado para começar a desenvolver!**

Qualquer dúvida, consulte a [documentação completa](./README.md).
