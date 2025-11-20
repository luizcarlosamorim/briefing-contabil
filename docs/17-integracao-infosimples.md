# 🔍 Integração API Infosimples (CNPJ)

## Visão Geral

O sistema integra-se com a API Infosimples para consultar dados de CNPJ diretamente na Receita Federal do Brasil, permitindo preenchimento automático de formulários.

---

## 1. Sobre a API Infosimples

### Descrição
Serviço profissional de consultas automatizadas a bases públicas brasileiras.

**Website:** https://www.infosimples.com
**Documentação:** https://api.infosimples.com/docs

### Características
- ✅ Consulta em tempo real na Receita Federal
- ✅ Dados oficiais e atualizados
- ✅ Retorna dados completos da empresa
- ✅ Inclui Quadro de Sócios e Administradores (QSA)
- ✅ PDFs e HTMLs de comprovação
- ✅ Alta disponibilidade (99.9% uptime)

### Planos
| Plano      | Consultas/mês | Valor Aprox.  |
|------------|---------------|---------------|
| Básico     | 100           | R$ 50/mês     |
| Padrão     | 500           | R$ 200/mês    |
| Avançado   | 2.000         | R$ 600/mês    |
| Enterprise | Ilimitado     | Sob consulta  |

---

## 2. Endpoint Utilizado

### Consulta de CNPJ

**URL:** `https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj`

**Método:** `POST`

**Headers:**
```http
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "token": "SEU_TOKEN_AQUI",
  "cnpj": "00000000000191",
  "timeout": 300
}
```

**Parâmetros:**
| Campo   | Tipo   | Obrigatório | Descrição                              |
|---------|--------|-------------|----------------------------------------|
| token   | string | Sim         | Token de autenticação da API           |
| cnpj    | string | Sim         | CNPJ sem formatação (14 dígitos)       |
| timeout | number | Não         | Timeout em segundos (padrão: 300)      |

---

## 3. Resposta da API

### Estrutura de Resposta

**Sucesso (code: 200):**
```json
{
  "code": 200,
  "code_message": "OK",
  "header": {
    "id": "abc123xyz",
    "created_at": "2025-01-14T10:00:00.000Z",
    "time_elapsed": 2.5
  },
  "site_receipts": [
    "https://cdn.infosimples.com/receipts/pdf/xyz123.pdf",
    "https://cdn.infosimples.com/receipts/html/xyz123.html"
  ],
  "data": [
    {
      "cnpj": "00.000.000/0001-91",
      "razao_social": "EMPRESA EXEMPLO LTDA",
      "nome_fantasia": "EXEMPLO",
      "situacao_cadastral": "ATIVA",
      "data_situacao_cadastral": "01/01/2020",
      "data_abertura": "01/01/2015",

      "logradouro": "RUA EXEMPLO",
      "numero": "123",
      "complemento": "SALA 456",
      "bairro": "CENTRO",
      "municipio": "SAO PAULO",
      "uf": "SP",
      "cep": "01234-567",

      "telefone_1": "(11) 1234-5678",
      "telefone_2": null,
      "email": "contato@exemplo.com.br",

      "natureza_juridica": "206-2 - SOCIEDADE EMPRESARIA LIMITADA",
      "porte": "DEMAIS",
      "capital_social": "100000.00",

      "atividade_principal": [
        {
          "code": "6201-5/00",
          "text": "DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA"
        }
      ],
      "atividades_secundarias": [
        {
          "code": "6202-3/00",
          "text": "DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR CUSTOMIZAVEIS"
        }
      ],

      "qsa": [
        {
          "nome_socio": "JOAO DA SILVA",
          "qualificacao_socio": "Sócio-Administrador",
          "data_entrada_sociedade": "01/01/2015",
          "cpf_cnpj_socio": "***123456**",
          "percentual_capital_social": null,
          "representante_legal": null,
          "nome_representante": null
        },
        {
          "nome_socio": "MARIA SANTOS",
          "qualificacao_socio": "Sócio",
          "data_entrada_sociedade": "01/01/2015",
          "cpf_cnpj_socio": "***654321**",
          "percentual_capital_social": null,
          "representante_legal": null,
          "nome_representante": null
        }
      ],

      "situacao_especial": null,
      "data_situacao_especial": null,

      "opcao_simples": "Não optante",
      "opcao_mei": "Não"
    }
  ]
}
```

### Códigos de Resposta

| Code | Mensagem                        | Descrição                                    |
|------|---------------------------------|----------------------------------------------|
| 200  | OK                              | Consulta realizada com sucesso               |
| 601  | Token inválido                  | Token de autenticação inválido               |
| 603  | Sem autorização                 | Token sem permissão para este serviço        |
| 604  | CNPJ inválido                   | CNPJ fornecido é inválido                    |
| 605  | Timeout                         | Tempo de consulta excedido                   |
| 608  | CNPJ não encontrado             | CNPJ não existe na Receita Federal           |
| 612  | Sem dados                       | CNPJ não retornou dados                      |
| 615  | RF indisponível                 | Receita Federal temporariamente indisponível |
| 620  | Erro permanente                 | Erro que não será resolvido com retry        |

---

## 4. Implementação no Frontend

### Código React (App.jsx)

```javascript
const buscarDadosCNPJ = async (cnpj) => {
  const cnpjLimpo = limparCNPJ(cnpj);

  // Validação
  if (!validarCNPJ(cnpj)) {
    alert('⚠️ CNPJ inválido. Digite um CNPJ válido com 14 dígitos.');
    return;
  }

  setBuscandoCNPJ(true);
  setCnpjEncontrado(null);

  try {
    console.log('🔍 Consultando CNPJ via Infosimples API...');

    const response = await fetch('https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        token: 'Pqxn0mTuAuh1lCnPiYrENoiCMtdDNj_dd9cauxt6',
        cnpj: cnpjLimpo,
        timeout: 300
      })
    });

    const result = await response.json();

    // Tratamento de erros
    if (result.code !== 200) {
      const mensagemErro = getMensagemErro(result.code, result.code_message);
      alert(`❌ ${mensagemErro}\n\nCódigo: ${result.code}`);
      return;
    }

    // Sucesso
    const dadosCNPJ = result.data[0];
    const dadosNormalizados = normalizarDados(dadosCNPJ);

    setCnpjEncontrado(dadosNormalizados);

    // Confirmação e preenchimento
    const confirmacao = window.confirm(gerarResumo(dadosNormalizados));
    if (confirmacao) {
      preencherDadosCNPJ(dadosNormalizados);
    }

  } catch (error) {
    console.error('❌ Erro ao buscar CNPJ:', error);
    alert('Erro ao conectar com a API Infosimples.');
  } finally {
    setBuscandoCNPJ(false);
  }
};
```

### Normalização de Dados

```javascript
const normalizarDados = (dadosCNPJ) => {
  return {
    // Dados básicos
    nome: dadosCNPJ.razao_social || dadosCNPJ.nome,
    fantasia: dadosCNPJ.nome_fantasia,
    cnpj: dadosCNPJ.cnpj,
    situacao: dadosCNPJ.situacao_cadastral,
    data_situacao: dadosCNPJ.data_situacao_cadastral,

    // Endereço
    logradouro: dadosCNPJ.logradouro,
    numero: dadosCNPJ.numero,
    complemento: dadosCNPJ.complemento,
    bairro: dadosCNPJ.bairro,
    municipio: dadosCNPJ.municipio,
    uf: dadosCNPJ.uf,
    cep: dadosCNPJ.cep,

    // Contato
    email: dadosCNPJ.email,
    telefone: dadosCNPJ.telefone_1 || dadosCNPJ.telefone,

    // Atividades
    atividade_principal: dadosCNPJ.atividade_principal,
    atividades_secundarias: dadosCNPJ.atividades_secundarias,

    // Dados societários
    natureza_juridica: dadosCNPJ.natureza_juridica,
    capital_social: dadosCNPJ.capital_social,
    porte: dadosCNPJ.porte,
    qsa: dadosCNPJ.qsa,

    // Datas
    data_abertura: dadosCNPJ.data_abertura,

    // Situação especial
    situacao_especial: dadosCNPJ.situacao_especial,
    data_situacao_especial: dadosCNPJ.data_situacao_especial,

    // Optantes
    opcao_simples: dadosCNPJ.opcao_simples,
    opcao_mei: dadosCNPJ.opcao_mei,

    // Metadata
    header: result.header,
    site_receipts: result.site_receipts
  };
};
```

### Preenchimento Automático

```javascript
const preencherDadosCNPJ = (dadosCNPJ) => {
  setDados(prev => ({
    ...prev,
    entidadeNome: dadosCNPJ.nome,
    endereco: {
      logradouro: dadosCNPJ.logradouro,
      numero: dadosCNPJ.numero,
      complemento: dadosCNPJ.complemento,
      bairro: dadosCNPJ.bairro,
      cidade: dadosCNPJ.municipio,
      uf: dadosCNPJ.uf,
      cep: dadosCNPJ.cep.replace(/[^\d]/g, ''),
      tipoImovel: prev.endereco.tipoImovel
    },
    objetoSocial: dadosCNPJ.atividade_principal?.[0]?.text,
    dadosGerais: {
      ...prev.dadosGerais,
      nomeCliente: dadosCNPJ.nome,
      email: dadosCNPJ.email || prev.dadosGerais.email,
      telefone: dadosCNPJ.telefone || prev.dadosGerais.telefone
    }
  }));

  // Identificar tipo de entidade
  const tipoIdentificado = identificarTipoEntidade(dadosCNPJ.natureza_juridica);
  if (tipoIdentificado) {
    setTipoEntidade(tipoIdentificado);
  }

  // Importar sócios
  if (dadosCNPJ.qsa?.length > 0) {
    importarSocios(dadosCNPJ.qsa);
  }

  alert('✅ Dados importados com sucesso!');
};
```

### Identificação Automática de Tipo de Entidade

```javascript
const identificarTipoEntidade = (naturezaJuridica) => {
  const natureza = (naturezaJuridica || '').toLowerCase();

  if (natureza.includes('associação') || natureza.includes('associacao')) {
    return 'associacao';
  }

  if (natureza.includes('sociedade anônima') ||
      natureza.includes('s/a') ||
      natureza.includes('s.a')) {
    return 'sa';
  }

  if (natureza.includes('limitada') || natureza.includes('ltda')) {
    return 'limitada';
  }

  if (natureza.includes('simples')) {
    return 'simples';
  }

  if (natureza.includes('holding')) {
    return 'holding';
  }

  return null;
};
```

---

## 5. Migração para Backend (Recomendado)

### Por que migrar?

**Problemas da implementação atual (Frontend):**
- ❌ Token exposto no código do cliente
- ❌ Facilita uso indevido da API
- ❌ Impossível controlar consumo
- ❌ Vulnerável a ataques

**Vantagens do Backend:**
- ✅ Token seguro em variável de ambiente
- ✅ Rate limiting por usuário
- ✅ Cache de consultas
- ✅ Logs e auditoria
- ✅ Controle de custos

### Implementação Backend (NestJS)

#### 1. Criar Módulo de Integração

```typescript
// src/integrations/infosimples/infosimples.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InfosimplesService {
  private readonly apiUrl = 'https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj';
  private readonly token: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.token = this.configService.get<string>('INFOSIMPLES_TOKEN');
  }

  async consultarCNPJ(cnpj: string) {
    // Validar CNPJ
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) {
      throw new HttpException('CNPJ inválido', 400);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, {
          token: this.token,
          cnpj: cnpjLimpo,
          timeout: 300,
        }),
      );

      const result = response.data;

      if (result.code !== 200) {
        throw new HttpException(
          this.getMensagemErro(result.code),
          result.code === 604 ? 400 : 500,
        );
      }

      return this.normalizarDados(result.data[0], result);
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar CNPJ',
        error.response?.status || 500,
      );
    }
  }

  private normalizarDados(dados: any, result: any) {
    return {
      nome: dados.razao_social,
      fantasia: dados.nome_fantasia,
      cnpj: dados.cnpj,
      situacao: dados.situacao_cadastral,
      endereco: {
        logradouro: dados.logradouro,
        numero: dados.numero,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.municipio,
        uf: dados.uf,
        cep: dados.cep,
      },
      contato: {
        email: dados.email,
        telefone: dados.telefone_1,
      },
      atividadePrincipal: dados.atividade_principal?.[0]?.text,
      capitalSocial: dados.capital_social,
      porte: dados.porte,
      naturezaJuridica: dados.natureza_juridica,
      qsa: dados.qsa,
      comprovantes: result.site_receipts,
    };
  }

  private getMensagemErro(code: number): string {
    const erros = {
      601: 'Token inválido',
      603: 'Sem autorização para este serviço',
      604: 'CNPJ inválido',
      605: 'Tempo de consulta excedido',
      608: 'CNPJ não encontrado',
      612: 'CNPJ sem dados',
      615: 'Receita Federal indisponível',
      620: 'Erro permanente na consulta',
    };
    return erros[code] || 'Erro desconhecido';
  }
}
```

#### 2. Controller

```typescript
// src/integrations/infosimples/infosimples.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InfosimplesService } from './infosimples.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('integrations/cnpj')
export class InfosimplesController {
  constructor(private infosimplesService: InfosimplesService) {}

  @Get()
  // @UseGuards(JwtAuthGuard) // Opcional: exigir autenticação
  async consultarCNPJ(@Query('cnpj') cnpj: string) {
    return this.infosimplesService.consultarCNPJ(cnpj);
  }
}
```

#### 3. Chamada do Frontend

```javascript
// Frontend atualizado
const buscarDadosCNPJ = async (cnpj) => {
  try {
    const response = await fetch(`/api/integrations/cnpj?cnpj=${cnpj}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Se autenticação for necessária
      }
    });

    const dados = await response.json();
    preencherDadosCNPJ(dados);
  } catch (error) {
    alert('Erro ao consultar CNPJ');
  }
};
```

---

## 6. Cache de Consultas (Otimização)

### Implementar Cache Redis

```typescript
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class InfosimplesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async consultarCNPJ(cnpj: string) {
    // Verificar cache
    const cacheKey = `cnpj:${cnpj}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('✅ CNPJ encontrado em cache');
      return cached;
    }

    // Consultar API
    const dados = await this.consultarAPI(cnpj);

    // Salvar em cache (24 horas)
    await this.cacheManager.set(cacheKey, dados, 86400);

    return dados;
  }
}
```

---

## 7. Boas Práticas

### 1. Rate Limiting
```typescript
// Limitar consultas por usuário
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 consultas por minuto
async consultarCNPJ() {}
```

### 2. Logs e Auditoria
```typescript
this.logger.log(`Consulta CNPJ: ${cnpj} por usuário ${userId}`);
```

### 3. Tratamento de Erros
```typescript
try {
  return await this.infosimples.consultarCNPJ(cnpj);
} catch (error) {
  this.logger.error(`Erro consulta CNPJ ${cnpj}:`, error);
  throw new HttpException('Serviço temporariamente indisponível', 503);
}
```

### 4. Webhooks (Futuro)
- Receber notificações de alterações cadastrais
- Atualizar briefings automaticamente

---

## 8. Custos e Otimização

### Estratégias de Redução de Custos

1. **Cache agressivo**: 24-48h para dados cadastrais
2. **Debounce**: Evitar consultas duplicadas
3. **Validação prévia**: Validar CNPJ antes de consultar
4. **Modo demo**: Usar dados mock em desenvolvimento
5. **Limitar tentativas**: Máximo 3 tentativas por usuário/dia

### Monitoramento

```typescript
// Contabilizar consultas
await this.metricsService.incrementar('infosimples.consultas', {
  usuario: userId,
  resultado: 'sucesso',
  code: 200
});
```

---

**Última atualização:** 2025-01-14
