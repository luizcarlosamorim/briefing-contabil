# 🚀 Plano de Implementação - Reestruturação Completa

## 📋 O que vou fazer AGORA

### 1️⃣ Backend: Criar Serviço Infosimples (PRIORIDADE MÁXIMA)
**Tempo:** 1 hora
**Por quê:** Segurança crítica - token exposto

**Arquivos a criar:**
```
apps/api/src/modules/integration/
├── infosimples/
│   ├── infosimples.module.ts
│   ├── infosimples.controller.ts
│   ├── infosimples.service.ts
│   └── dto/
│       └── cnpj-response.dto.ts
```

**Endpoint:** `GET /api/cnpj?cnpj=00000000000191`

---

### 2️⃣ Frontend: Refatorar App.jsx
**Tempo:** 4-5 horas
**Por quê:** 1800 linhas é insustentável

**Nova estrutura:**
```
apps/web/src/
├── components/
│   ├── briefing/
│   │   ├── BriefingForm/
│   │   │   ├── index.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── steps/
│   │   │       ├── DadosGerais.tsx
│   │   │       ├── TipoEntidade.tsx
│   │   │       ├── DadosEntidade.tsx
│   │   │       ├── Socios/
│   │   │       │   ├── SociosList.tsx
│   │   │       │   └── SocioCard.tsx
│   │   │       ├── Especificos/
│   │   │       │   ├── index.tsx
│   │   │       │   ├── Associacao.tsx
│   │   │       │   ├── SPE.tsx
│   │   │       │   └── ...
│   │   │       └── Revisao.tsx
│   │   └── CNPJSearch/
│   │       └── index.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Loading.tsx
├── contexts/
│   └── BriefingContext.tsx
├── hooks/
│   ├── useBriefing.ts
│   └── useCNPJ.ts
└── services/
    ├── api.ts
    └── cnpj.service.ts
```

---

### 3️⃣ Docker: Setup Completo
**Tempo:** 2 horas

**Arquivos:**
```
docker/
├── web/
│   └── Dockerfile
├── api/
│   └── Dockerfile
└── docker-compose.yml  (orquestração)
```

**Containers:**
- PostgreSQL
- Backend (NestJS)
- Frontend (React)
- Nginx (Reverse Proxy)

---

### 4️⃣ Scripts de Automação
**Tempo:** 1 hora

```bash
scripts/
├── dev.sh          # Rodar dev completo
├── build.sh        # Build tudo
├── test.sh         # Rodar testes
└── docker-dev.sh   # Docker desenvolvimento
```

---

## 🎯 Ordem de Implementação

### Fase 1: Backend Security (AGORA - 1h)
✅ Criar módulo Infosimples
✅ Mover token para backend/.env
✅ Endpoint /api/cnpj

### Fase 2: Frontend Refactor (2h)
✅ Criar estrutura de componentes
✅ BriefingContext
✅ Hooks customizados
✅ Quebrar App.jsx

### Fase 3: UX Improvements (1h)
✅ React Hot Toast
✅ Loading states
✅ Error handling

### Fase 4: Docker (2h)
✅ Dockerfiles
✅ Docker Compose
✅ Scripts

### Fase 5: Testing (1h)
✅ Testar tudo localmente
✅ Validar Docker
✅ Documentar

---

## 📦 Vou criar os arquivos na seguinte ordem:

1. **Backend - Infosimples Service** (20 min)
2. **Backend - Infosimples Controller** (10 min)
3. **Backend - Infosimples Module** (10 min)
4. **Frontend - CNPJService** (10 min)
5. **Frontend - BriefingContext** (20 min)
6. **Frontend - Componentes Base** (30 min)
7. **Frontend - Steps Components** (60 min)
8. **Frontend - App.tsx refatorado** (20 min)
9. **Docker - Dockerfiles** (30 min)
10. **Docker - Docker Compose** (30 min)
11. **Scripts - Automação** (30 min)
12. **README atualizado** (15 min)

**Total:** ~5 horas

---

## 🚀 Começando AGORA!

Vou criar os arquivos progressivamente e mostrar o progresso.
