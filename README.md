# 📊 Sistema de Briefing Contábil

Sistema profissional para coleta e gestão de briefings contábeis.

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install
cd backend && npm install && cd ..

# 2. Iniciar banco de dados
docker-compose up -d

# 3. Backend (Terminal 1)
cd backend && npm run start:dev

# 4. Frontend (Terminal 2)
npm run dev
```

**Acesse:** http://localhost:5173

---

## 📚 Documentação Completa

- **🎯 [Próximos Passos](./PROXIMOS-PASSOS.md)** - Comece aqui!
- **📖 [Setup Local](./SETUP-LOCAL.md)** - Guia detalhado de instalação
- **🔍 [Análise do Projeto](./ANALISE-PROJETO.md)** - Lacunas e melhorias
- **📚 [Documentação Técnica](./docs/README.md)** - Completa (11 documentos)

---

## 🏗️ Estrutura do Projeto

```
briefing-vercel/
├── src/                    # Frontend (React + Vite)
│   ├── App.jsx            # Componente principal
│   ├── admin/             # Login admin
│   ├── hooks/             # React hooks
│   └── services/          # API client
│
├── backend/               # Backend (NestJS)
│   └── src/
│       ├── auth/          # Autenticação JWT
│       ├── briefings/     # Core do sistema
│       ├── users/         # Gestão de usuários
│       └── config/        # Configurações
│
├── docs/                  # Documentação (11 arquivos)
├── docker-compose.yml     # PostgreSQL
├── .env                   # Variáveis frontend
└── backend/.env           # Variáveis backend
```

---

## 🛠️ Tecnologias

- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** NestJS + TypeORM + PostgreSQL
- **Auth:** JWT + Bcrypt
- **Integração:** API Infosimples (CNPJ)

---

## ⚠️ Status do Projeto

✅ **Funcionando:** 85% completo
🔴 **Atenção:** Melhorias críticas necessárias (ver [ANALISE-PROJETO.md](./ANALISE-PROJETO.md))

### Melhorias Urgentes

1. 🔴 **Segurança:** Mover token Infosimples para backend
2. 🔴 **Performance:** Refatorar App.jsx (1800+ linhas)
3. 🟡 **UX:** Melhorar tratamento de erros

---

## 📞 Suporte

- **Documentação:** [docs/README.md](./docs/README.md)
- **Issues:** GitHub Issues
- **Email:** suporte@briefingcontabil.com.br

---

**Última atualização:** 2025-01-14
