# 🔄 Reestruturação do Projeto - Briefing Contábil

## 📊 Problema Identificado

**Estrutura Atual:**
```
briefing-vercel/          ❌ Nome não profissional
├── src/                  ❌ Frontend na raiz
├── backend/              ❌ Backend como subpasta
├── docs/
└── ...
```

**Problemas:**
- ❌ Nome "briefing-vercel" não é profissional
- ❌ Frontend e backend não estão no mesmo nível
- ❌ Não fica claro o que é frontend/backend
- ❌ Dificulta trabalho em equipe
- ❌ Não segue padrão monorepo profissional

---

## ✅ Nova Estrutura Proposta

### Opção 1: Estrutura Monorepo Profissional (RECOMENDADA)

```
briefing-contabil/                    # Nome profissional
│
├── apps/                             # Aplicações
│   ├── web/                          # Frontend (React)
│   │   ├── src/
│   │   │   ├── components/           # Componentes React
│   │   │   │   ├── briefing/        # Funcionalidade de briefing
│   │   │   │   │   ├── BriefingForm/
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   ├── steps/
│   │   │   │   │   │   │   ├── DadosGerais.tsx
│   │   │   │   │   │   │   ├── TipoEntidade.tsx
│   │   │   │   │   │   │   ├── DadosEntidade.tsx
│   │   │   │   │   │   │   ├── Socios/
│   │   │   │   │   │   │   │   ├── SociosList.tsx
│   │   │   │   │   │   │   │   ├── SocioCard.tsx
│   │   │   │   │   │   │   │   └── SocioForm.tsx
│   │   │   │   │   │   │   ├── Especificos/
│   │   │   │   │   │   │   │   ├── Associacao.tsx
│   │   │   │   │   │   │   │   ├── SPE.tsx
│   │   │   │   │   │   │   │   ├── SA.tsx
│   │   │   │   │   │   │   │   └── ...
│   │   │   │   │   │   │   └── Revisao.tsx
│   │   │   │   │   │   └── ProgressBar.tsx
│   │   │   │   │   ├── CNPJSearch/
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   └── CNPJDisplay.tsx
│   │   │   │   │   └── ExportReport/
│   │   │   │   ├── admin/              # Área administrativa
│   │   │   │   │   ├── Login.tsx
│   │   │   │   │   ├── Dashboard/
│   │   │   │   │   └── BriefingList/
│   │   │   │   ├── common/             # Componentes reutilizáveis
│   │   │   │   │   ├── Button/
│   │   │   │   │   ├── Input/
│   │   │   │   │   ├── Select/
│   │   │   │   │   ├── Loading/
│   │   │   │   │   └── ErrorBoundary/
│   │   │   │   └── layout/             # Layouts
│   │   │   │       ├── MainLayout.tsx
│   │   │   │       └── AdminLayout.tsx
│   │   │   │
│   │   │   ├── features/               # Features (opcional)
│   │   │   │   ├── briefing/
│   │   │   │   └── auth/
│   │   │   │
│   │   │   ├── hooks/                  # Custom hooks
│   │   │   │   ├── useBriefing.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCNPJ.ts
│   │   │   │   └── useToast.ts
│   │   │   │
│   │   │   ├── contexts/               # React contexts
│   │   │   │   ├── BriefingContext.tsx
│   │   │   │   └── AuthContext.tsx
│   │   │   │
│   │   │   ├── services/               # API services
│   │   │   │   ├── api.ts              # Cliente HTTP
│   │   │   │   ├── briefing.service.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── cnpj.service.ts
│   │   │   │
│   │   │   ├── types/                  # TypeScript types
│   │   │   │   ├── briefing.types.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   └── api.types.ts
│   │   │   │
│   │   │   ├── utils/                  # Utilitários
│   │   │   │   ├── validators.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   ├── styles/                 # Estilos globais
│   │   │   │   ├── globals.css
│   │   │   │   └── tailwind.css
│   │   │   │
│   │   │   ├── App.tsx                 # App principal
│   │   │   └── main.tsx                # Entry point
│   │   │
│   │   ├── public/                     # Assets públicos
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   │
│   └── api/                            # Backend (NestJS)
│       ├── src/
│       │   ├── modules/                # Módulos funcionais
│       │   │   ├── briefing/
│       │   │   │   ├── briefing.module.ts
│       │   │   │   ├── briefing.controller.ts
│       │   │   │   ├── briefing.service.ts
│       │   │   │   ├── entities/
│       │   │   │   │   ├── briefing.entity.ts
│       │   │   │   │   └── socio.entity.ts
│       │   │   │   └── dto/
│       │   │   │       ├── create-briefing.dto.ts
│       │   │   │       ├── update-briefing.dto.ts
│       │   │   │       └── filter-briefing.dto.ts
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   ├── jwt.strategy.ts
│       │   │   │   │   └── local.strategy.ts
│       │   │   │   └── guards/
│       │   │   │       ├── jwt-auth.guard.ts
│       │   │   │       └── local-auth.guard.ts
│       │   │   │
│       │   │   ├── user/
│       │   │   │   ├── user.module.ts
│       │   │   │   ├── user.controller.ts
│       │   │   │   ├── user.service.ts
│       │   │   │   └── entities/
│       │   │   │       └── user.entity.ts
│       │   │   │
│       │   │   └── integration/        # 🆕 Integrações externas
│       │   │       └── infosimples/
│       │   │           ├── infosimples.module.ts
│       │   │           ├── infosimples.controller.ts
│       │   │           ├── infosimples.service.ts
│       │   │           └── dto/
│       │   │               └── cnpj-response.dto.ts
│       │   │
│       │   ├── common/                 # Compartilhado
│       │   │   ├── decorators/
│       │   │   ├── filters/
│       │   │   ├── guards/
│       │   │   ├── interceptors/
│       │   │   ├── pipes/
│       │   │   └── interfaces/
│       │   │
│       │   ├── config/                 # Configurações
│       │   │   ├── database.config.ts
│       │   │   ├── jwt.config.ts
│       │   │   └── app.config.ts
│       │   │
│       │   ├── database/               # Database específico
│       │   │   ├── migrations/
│       │   │   └── seeds/
│       │   │
│       │   ├── app.module.ts
│       │   └── main.ts
│       │
│       ├── test/                       # Testes
│       ├── .env.example
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
│
├── docker/                             # Docker configs
│   ├── web/
│   │   └── Dockerfile
│   ├── api/
│   │   └── Dockerfile
│   ├── postgres/
│   │   └── init.sql
│   └── docker-compose.yml
│
├── docs/                               # Documentação
│   ├── api/                           # Docs da API
│   ├── architecture/                  # Arquitetura
│   ├── guides/                        # Guias
│   └── ...
│
├── scripts/                            # Scripts úteis
│   ├── dev.sh                         # Rodar em desenvolvimento
│   ├── build.sh                       # Build completo
│   ├── test.sh                        # Rodar testes
│   └── deploy.sh                      # Deploy
│
├── .github/                            # CI/CD
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .gitignore                          # Git ignore global
├── .env.example                        # Env template global
├── docker-compose.yml                  # Docker compose raiz
├── package.json                        # Root package.json (workspace)
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

### Opção 2: Estrutura Simples (Mais Fácil de Migrar)

```
briefing-contabil/
├── client/                   # Frontend
├── server/                   # Backend
├── docker/                   # Docker
├── docs/                     # Docs
└── scripts/                  # Scripts
```

---

## 🔄 Plano de Migração

### Fase 1: Preparação (30 min)
1. Criar nova estrutura de pastas
2. Mover arquivos gradualmente
3. Atualizar imports

### Fase 2: Refatoração Frontend (4-6h)
1. Quebrar App.jsx em componentes
2. Criar contexts
3. Criar hooks customizados
4. TypeScript (opcional)

### Fase 3: Refatoração Backend (2-3h)
1. Criar módulo Infosimples
2. Reorganizar estrutura
3. Melhorar organização

### Fase 4: Docker (2h)
1. Dockerfiles individuais
2. Docker Compose completo
3. Scripts de automação

---

## 📋 Vantagens da Nova Estrutura

### ✅ Profissionalismo
- Nomenclatura clara
- Padrão da indústria
- Fácil onboarding de devs

### ✅ Manutenibilidade
- Componentes pequenos e focados
- Responsabilidades bem definidas
- Testes mais fáceis

### ✅ Escalabilidade
- Fácil adicionar features
- Monorepo permite shared code
- CI/CD facilitado

### ✅ Performance
- Code splitting natural
- Lazy loading fácil
- Bundle otimizado

---

## 🚀 Próximos Passos

**Escolha:**
- [ ] Opção 1: Monorepo completo (profissional mas mais trabalho)
- [ ] Opção 2: Estrutura simples (mais rápido)

**Após escolher, vou:**
1. Criar nova estrutura
2. Mover arquivos
3. Refatorar App.jsx
4. Implementar melhorias
5. Criar Docker setup
6. Scripts de automação

**Quanto tempo:**
- Opção 1: ~8-10 horas
- Opção 2: ~4-6 horas

---

**Qual estrutura você prefere? Opção 1 ou 2?**
