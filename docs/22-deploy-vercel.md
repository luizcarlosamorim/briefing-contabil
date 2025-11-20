# 🚀 Deploy na Vercel

## Visão Geral

Guia completo para deploy do Sistema de Briefing Contábil na plataforma Vercel.

---

## 1. Pré-requisitos

### Conta Vercel
- Criar conta em: https://vercel.com/signup
- Conectar com GitHub/GitLab/Bitbucket

### Repositório Git
- Código versionado no Git
- Repositório público ou privado
- Branch principal (`main` ou `master`)

### Banco de Dados PostgreSQL
Opções recomendadas:
- **Supabase**: https://supabase.com (Gratuito)
- **Neon**: https://neon.tech (Gratuito)
- **Railway**: https://railway.app (Plano gratuito limitado)
- **AWS RDS**: Pago, alta performance

---

## 2. Estrutura do Projeto para Vercel

### 2.1 Monorepo (Frontend + Backend)

```
briefing-vercel/
├── frontend/                 # React app
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # NestJS API
│   ├── src/
│   ├── package.json
│   └── nest-cli.json
│
├── vercel.json              # Configuração Vercel
└── package.json             # Root package.json
```

### 2.2 Separado (Recomendado para produção)

**Frontend:** Repositório separado
**Backend:** Deploy em plataforma dedicada (Railway, Render, AWS)

---

## 3. Configuração do Frontend

### 3.1 Arquivo `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 3.2 `package.json` Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

### 3.3 Variáveis de Ambiente

Criar arquivo `.env.production`:

```env
VITE_API_URL=https://api.seudominio.com
VITE_INFOSIMPLES_TOKEN=seu_token_aqui
```

**Na Vercel Dashboard:**
- Settings → Environment Variables
- Adicionar cada variável
- Selecionar: Production, Preview, Development

---

## 4. Deploy Frontend via GitHub

### Passo 1: Push para GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/briefing-contabil.git
git push -u origin main
```

### Passo 2: Importar na Vercel

1. Acesse: https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` ou `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Adicione variáveis de ambiente

6. Clique em "Deploy"

### Passo 3: Aguardar Build

```
Building...
✓ Initializing build
✓ Running "npm install"
✓ Running "npm run build"
✓ Uploading build output
✓ Build completed

✅ Deployment ready
```

---

## 5. Configuração do Backend

### 5.1 Opção 1: Vercel Serverless Functions

**Limitações:**
- Timeout de 10s (Hobby) / 60s (Pro)
- Sem WebSockets persistentes
- Cold starts

**Estrutura:**
```
api/
├── auth/
│   ├── login.ts
│   └── register.ts
├── briefings/
│   ├── index.ts
│   ├── [id].ts
│   └── statistics.ts
└── _utils/
    └── db.ts
```

**Exemplo de Function:**
```typescript
// api/briefings/index.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../../backend/src/app.module';
import express from 'express';

const server = express();
let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    await app.init();
  }
  return server;
}

export default async (req, res) => {
  const server = await bootstrap();
  return server(req, res);
};
```

### 5.2 Opção 2: Backend Dedicado (Recomendado)

**Plataformas sugeridas:**

#### Railway (Recomendado)
- Deploy automático via Git
- PostgreSQL incluído
- Preço justo
- URL: https://railway.app

**Setup:**
```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Iniciar projeto
railway init

# Deploy
railway up
```

#### Render
- Plano gratuito disponível
- Auto-deploy via Git
- URL: https://render.com

#### AWS Elastic Beanstalk
- Escalável
- Mais complexo
- Melhor para produção enterprise

---

## 6. Configuração de Banco de Dados

### 6.1 Supabase (Grátis)

1. Criar projeto: https://app.supabase.com
2. Obter connection string:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

3. Adicionar variáveis de ambiente:
   ```env
   DATABASE_HOST=db.xxxxx.supabase.co
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=sua_senha
   DATABASE_NAME=postgres
   DATABASE_SSL=true
   ```

### 6.2 Neon (Serverless Postgres)

1. Criar projeto: https://neon.tech
2. Obter connection string
3. Configurar variáveis

**Vantagens:**
- Serverless (paga pelo uso)
- Branching para desenvolvimento
- Backup automático

### 6.3 Executar Migrations

```bash
# Localmente
npm run migration:run

# Produção (via CLI do provedor)
railway run npm run migration:run
```

---

## 7. Domínio Personalizado

### 7.1 Configurar na Vercel

**Frontend:**
1. Settings → Domains
2. Adicionar domínio: `briefing.seudominio.com`
3. Configurar DNS:

**Opção A - CNAME (Recomendado):**
```
CNAME  briefing  cname.vercel-dns.com
```

**Opção B - A Record:**
```
A      briefing  76.76.21.21
```

4. Aguardar propagação (até 48h)

### 7.2 SSL/HTTPS

- Automático na Vercel
- Certificado Let's Encrypt
- Renovação automática

---

## 8. Configurações Avançadas

### 8.1 Redirects

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### 8.2 Headers de Segurança

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

### 8.3 Rewrites (Proxy para API)

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.seudominio.com/:path*"
    }
  ]
}
```

---

## 9. CI/CD Automático

### 9.1 Deploy Automático

**Vercel detecta automaticamente:**
- Push para `main` → Deploy em produção
- Push para outras branches → Preview deployment
- Pull Request → Preview deployment

### 9.2 Preview Deployments

Cada PR gera uma URL única:
```
https://briefing-git-feature-usuario.vercel.app
```

### 9.3 GitHub Actions (Opcional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Deploy
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 10. Monitoramento

### 10.1 Vercel Analytics

**Ativar:**
- Dashboard → Analytics → Enable

**Métricas:**
- Page views
- Unique visitors
- Top pages
- Referrers

### 10.2 Logs

**Visualizar logs:**
```bash
vercel logs [deployment-url]
```

**Real-time:**
```bash
vercel logs --follow
```

### 10.3 Alerts

Configurar em Settings → Notifications:
- Deploy success/failure
- Domain configuration
- Usage limits

---

## 11. Performance

### 11.1 Build Optimization

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
}
```

### 11.2 Image Optimization

**Usar Next.js Image (se migrar):**
```jsx
import Image from 'next/image'

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
/>
```

**Ou otimizar manualmente:**
- Comprimir imagens (TinyPNG)
- Usar WebP
- Lazy loading

### 11.3 Caching

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 12. Troubleshooting

### Erro: "Build failed"

**Verificar:**
- Logs de build na Vercel
- Rodar `npm run build` localmente
- Verificar variáveis de ambiente

### Erro: "Page not found"

**Solução:**
- Adicionar rota catch-all em `vercel.json`:
  ```json
  {
    "routes": [
      { "src": "/(.*)", "dest": "/index.html" }
    ]
  }
  ```

### Erro: "API timeout"

**Soluções:**
- Aumentar timeout (plano Pro)
- Migrar backend para plataforma dedicada
- Otimizar queries do banco

### Build muito lento

**Otimizações:**
- Remover dependências não utilizadas
- Usar `pnpm` ao invés de `npm`
- Configurar cache de build

---

## 13. Custos

### Plano Hobby (Gratuito)
- ✅ Banda ilimitada
- ✅ 100 GB-hours de execução
- ✅ Domínios customizados
- ✅ SSL automático
- ❌ 10s timeout serverless
- ❌ Sem proteção DDoS avançada

### Plano Pro ($20/mês)
- ✅ Tudo do Hobby
- ✅ 60s timeout serverless
- ✅ 1000 GB-hours
- ✅ Proteção DDoS
- ✅ Analytics avançado
- ✅ Suporte prioritário

### Plano Enterprise (Custom)
- ✅ SLA 99.99%
- ✅ Suporte dedicado
- ✅ Custom timeouts
- ✅ Compliance (SOC 2, GDPR)

---

## 14. Checklist de Deploy

### Pré-Deploy
- [ ] Testar build localmente
- [ ] Executar testes unitários
- [ ] Verificar variáveis de ambiente
- [ ] Revisar código de segurança
- [ ] Otimizar assets (imagens, CSS, JS)

### Deploy
- [ ] Push para repositório
- [ ] Verificar build na Vercel
- [ ] Testar em URL de preview
- [ ] Verificar API endpoints
- [ ] Testar em diferentes navegadores

### Pós-Deploy
- [ ] Configurar domínio personalizado
- [ ] Ativar Analytics
- [ ] Configurar alertas
- [ ] Monitorar logs
- [ ] Testar performance (Lighthouse)
- [ ] Atualizar documentação

---

## 15. Comandos Úteis

```bash
# Login na Vercel
vercel login

# Deploy local
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs

# Listar deployments
vercel ls

# Remover deployment
vercel rm [deployment-id]

# Listar variáveis de ambiente
vercel env ls

# Adicionar variável
vercel env add [name]

# Abrir dashboard
vercel open
```

---

## 16. Recursos Adicionais

### Documentação Oficial
- Vercel Docs: https://vercel.com/docs
- Vite + Vercel: https://vercel.com/docs/frameworks/vite
- NestJS Deploy: https://docs.nestjs.com/deployment

### Ferramentas
- Vercel CLI: `npm i -g vercel`
- Status Page: https://vercel-status.com

### Suporte
- Community: https://github.com/vercel/vercel/discussions
- Discord: https://vercel.com/discord

---

**Última atualização:** 2025-01-14
