# 📚 Documentação Completa - Sistema de Briefing Contábil

## Visão Geral

Sistema profissional de coleta e gestão de briefings contábeis para abertura, regularização e análise de viabilidade de entidades empresariais.

**Versão:** 1.0.0
**Última Atualização:** 2025-01-14

---

## 📖 Índice da Documentação

### 1. Arquitetura e Estrutura
- [Arquitetura do Sistema](./01-arquitetura.md)
- [Estrutura de Diretórios](./02-estrutura-diretorios.md)
- [Stack Tecnológico](./03-stack-tecnologico.md)

### 2. Banco de Dados
- [Modelo de Dados](./04-modelo-dados.md)
- [Entidades e Relacionamentos](./05-entidades.md)
- [Migrations e Seed](./06-migrations.md)

### 3. Backend (NestJS)
- [API Endpoints](./07-api-endpoints.md)
- [Autenticação e Autorização](./08-autenticacao.md)
- [Serviços e Lógica de Negócio](./09-servicos.md)
- [DTOs e Validações](./10-dtos-validacoes.md)

### 4. Frontend (React)
- [Componentes Principais](./11-componentes-frontend.md)
- [Fluxo de Usuário](./12-fluxo-usuario.md)
- [Hooks e Estado](./13-hooks-estado.md)

### 5. Processos Contábeis
- [Tipos de Entidades](./14-tipos-entidades.md)
- [Fluxo de Briefing](./15-fluxo-briefing.md)
- [Validações Contábeis](./16-validacoes-contabeis.md)

### 6. Integrações
- [API Infosimples (CNPJ)](./17-integracao-infosimples.md)
- [Exportação de Dados](./18-exportacao-dados.md)

### 7. Segurança e Compliance
- [Segurança da Aplicação](./19-seguranca.md)
- [LGPD e Proteção de Dados](./20-lgpd.md)

### 8. Deploy e Infraestrutura
- [Configuração de Ambiente](./21-configuracao-ambiente.md)
- [Deploy na Vercel](./22-deploy-vercel.md)
- [Monitoramento e Logs](./23-monitoramento.md)

### 9. Guias Práticos
- [Guia de Desenvolvimento](./24-guia-desenvolvimento.md)
- [Guia de Contribuição](./25-guia-contribuicao.md)
- [Troubleshooting](./26-troubleshooting.md)

### 10. Roadmap e Melhorias
- [Roadmap de Funcionalidades](./27-roadmap.md)
- [Melhorias Recomendadas](./28-melhorias.md)

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/briefing-contabil.git

# Instale dependências do frontend
npm install

# Instale dependências do backend
cd backend
npm install

# Configure variáveis de ambiente
cp .env.example .env

# Execute migrations
npm run migration:run

# Inicie o backend
npm run start:dev

# Em outro terminal, inicie o frontend
cd ..
npm run dev
```

### Acesso
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Documentação API: http://localhost:3000/api/docs

---

## 📊 Características Principais

### ✅ Funcionalidades Implementadas

- **Coleta de Dados Dinâmica**
  - 7 tipos de entidades suportadas
  - Formulários adaptativos por tipo
  - Validações em tempo real

- **Integração CNPJ**
  - Consulta automática na Receita Federal
  - Preenchimento automático de dados
  - Importação de QSA (Quadro de Sócios)

- **Gestão de Sócios**
  - Cadastro de PF e PJ
  - Controle de participação societária
  - Validação de restrições

- **Sistema de Autenticação**
  - JWT tokens
  - Controle de acesso por role
  - Gestão de usuários

- **Exportação de Dados**
  - Excel (.xlsx) formatado
  - CSV para importação
  - TXT para relatórios

- **Dashboard e Analytics**
  - Estatísticas em tempo real
  - Filtros avançados
  - Gráficos e métricas

---

## 🏗️ Arquitetura Resumida

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Briefing │  │  Admin   │  │  API Infosimples    │  │
│  │   Form   │  │  Login   │  │  (CNPJ Consulta)    │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
└───────┼─────────────┼───────────────────┼───────────────┘
        │             │                   │
        └─────────────┴───────────────────┘
                      │
        ┌─────────────▼────────────────────────────────────┐
        │            BACKEND (NestJS)                      │
        │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
        │  │   Auth   │  │ Briefing │  │   Export     │  │
        │  │  Module  │  │  Module  │  │   Service    │  │
        │  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
        └───────┼─────────────┼────────────────┼──────────┘
                │             │                │
        ┌───────▼─────────────▼────────────────▼──────────┐
        │         PostgreSQL Database                     │
        │  ┌──────┐  ┌──────────┐  ┌──────────┐          │
        │  │ Users│  │ Briefings│  │  Socios  │          │
        │  └──────┘  └──────────┘  └──────────┘          │
        └─────────────────────────────────────────────────┘
```

---

## 📞 Suporte e Contato

- **Documentação**: Este repositório
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/briefing-contabil/issues)
- **Email**: suporte@seudominio.com

---

## 📄 Licença

MIT License - veja [LICENSE](../LICENSE) para detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [Guia de Contribuição](./25-guia-contribuicao.md) antes de submeter pull requests.

---

**Desenvolvido com ❤️ para contadores e consultores empresariais**
