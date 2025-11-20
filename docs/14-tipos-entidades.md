# 🏢 Tipos de Entidades Jurídicas

## Visão Geral

O sistema suporta 7 tipos de entidades jurídicas, cada uma com características, requisitos e campos específicos próprios.

---

## 1. Associação Privada 🤝

### Descrição
Entidade sem fins lucrativos formada pela união de pessoas para fins não econômicos.

### Características Legais
- **Base Legal**: Código Civil, Art. 53 a 61
- **Natureza**: Pessoa Jurídica de Direito Privado
- **Finalidade**: Não lucrativa
- **Registro**: Cartório de Registro Civil de Pessoas Jurídicas

### Campos Específicos

| Campo                    | Tipo    | Obrigatório | Descrição                                    |
|--------------------------|---------|-------------|----------------------------------------------|
| finalidadePrincipal      | enum    | Sim         | cultural, esportiva, religiosa, educacao, saude, assistencia-social, outra |
| membrosDiretoria         | number  | Não         | Quantidade de membros da diretoria           |
| mandato                  | number  | Não         | Duração do mandato em anos (1-10)            |
| conselhoFiscal           | boolean | Não         | Possui Conselho Fiscal                       |
| conselhoDeliberativo     | boolean | Não         | Possui Conselho Deliberativo                 |
| remuneracaoDirigentes    | boolean | Não         | Permite remuneração de dirigentes            |
| mensalidade              | boolean | Não         | Cobra mensalidade dos associados             |

### Exemplo JSON
```json
{
  "tipoEntidade": "associacao",
  "especificos": {
    "finalidadePrincipal": "cultural",
    "membrosDiretoria": 5,
    "mandato": 2,
    "conselhoFiscal": true,
    "conselhoDeliberativo": false,
    "remuneracaoDirigentes": false,
    "mensalidade": true
  }
}
```

### Documentos Necessários
- [ ] Estatuto Social
- [ ] Ata de Constituição e Eleição da Diretoria
- [ ] Lista de Presença da Assembleia
- [ ] Documentos dos Fundadores
- [ ] Comprovante de Endereço da Sede

### Aspectos Tributários
- Isenta de IRPJ (se cumprir requisitos)
- Possível isenção de CSLL, PIS, COFINS
- Certificações: CEBAS, OSCIP, Utilidade Pública

---

## 2. OSCIP / ONG ❤️

### Descrição
Organização da Sociedade Civil de Interesse Público - entidade sem fins lucrativos voltada para atividades de interesse público.

### Características Legais
- **Base Legal**: Lei 9.790/1999
- **Natureza**: Pessoa Jurídica de Direito Privado
- **Finalidade**: Interesse público e social
- **Qualificação**: Ministério da Justiça

### Campos Específicos
**Idênticos à Associação Privada** (mesma estrutura base)

### Finalidades Permitidas
1. Assistência social
2. Cultura, arte e educação
3. Saúde gratuita
4. Segurança alimentar e nutricional
5. Defesa e conservação do meio ambiente
6. Desenvolvimento econômico e combate à pobreza
7. Experimentação científica
8. Promoção da ética, cidadania e direitos humanos
9. Estudos e pesquisas

### Requisitos Específicos OSCIP
- Ter finalidade social
- Ser transparente na gestão
- Ter Conselho Fiscal
- Publicar relatórios de atividades anualmente
- Não distribuir lucros

### Termo de Parceria
- Firmado com Poder Público
- Permite recebimento de recursos públicos
- Exige prestação de contas rigorosa

---

## 3. SPE - Sociedade de Propósito Específico 🎯

### Descrição
Empresa criada para um projeto específico, com prazo determinado de existência.

### Características Legais
- **Base Legal**: Lei das S.A. (Lei 6.404/1976) ou Código Civil
- **Natureza**: LTDA ou S.A.
- **Finalidade**: Projeto específico (isolamento de risco)
- **Prazo**: Determinado ou vinculado ao projeto

### Campos Específicos

| Campo               | Tipo   | Obrigatório | Descrição                                    |
|---------------------|--------|-------------|----------------------------------------------|
| finalidadeProjeto   | text   | Sim         | Descrição detalhada do projeto               |
| prazoProjeto        | string | Não         | Duração estimada do projeto                  |
| investimentoTotal   | string | Não         | Valor total do investimento                  |
| regrasSaida         | text   | Não         | Regras para saída de sócios                  |
| destinoPatrimonio   | text   | Não         | Destino dos bens ao fim do projeto           |

### Exemplo JSON
```json
{
  "tipoEntidade": "spe",
  "especificos": {
    "finalidadeProjeto": "Construção e comercialização de empreendimento imobiliário residencial no bairro X",
    "prazoProjeto": "36 meses",
    "investimentoTotal": "R$ 15.000.000,00",
    "regrasSaida": "Sócio que desejar sair deverá oferecer suas quotas aos demais sócios",
    "destinoPatrimonio": "Liquidação e distribuição proporcional às quotas"
  }
}
```

### Usos Comuns
- Empreendimentos imobiliários
- Projetos de infraestrutura
- PPP (Parcerias Público-Privadas)
- Incorporações
- Grandes obras

### Vantagens
- Isolamento de riscos
- Governança específica
- Facilitação de financiamento
- Transparência para investidores
- Eventual extinção automática

---

## 4. S.A. - Sociedade Anônima 📈

### Descrição
Sociedade empresarial de capital, dividido em ações, com responsabilidade limitada dos acionistas.

### Características Legais
- **Base Legal**: Lei 6.404/1976 (Lei das S.A.)
- **Capital**: Dividido em ações
- **Responsabilidade**: Limitada ao preço de emissão das ações
- **Registro**: Junta Comercial + CVM (se aberta)

### Campos Específicos

| Campo                  | Tipo    | Obrigatório | Descrição                                    |
|------------------------|---------|-------------|----------------------------------------------|
| tipoSA                 | enum    | Sim         | 'fechada' ou 'aberta'                        |
| capitalSocial          | string  | Sim         | Valor do capital social inicial              |
| numeroAcoes            | number  | Não         | Quantidade total de ações                    |
| classesAcoes           | enum    | Não         | 'ordinarias', 'preferenciais', 'ambas'       |
| acordoAcionistas       | boolean | Não         | Existirá acordo de acionistas                |
| conselhoAdministracao  | boolean | Não         | Terá conselho de administração               |

### Exemplo JSON
```json
{
  "tipoEntidade": "sa",
  "especificos": {
    "tipoSA": "fechada",
    "capitalSocial": "R$ 5.000.000,00",
    "numeroAcoes": 5000000,
    "classesAcoes": "ordinarias",
    "acordoAcionistas": true,
    "conselhoAdministracao": true
  }
}
```

### Tipos de Ações

**Ordinárias (ON)**
- Direito a voto
- Participação em lucros
- Preferência na subscrição

**Preferenciais (PN)**
- Prioridade na distribuição de dividendos
- Geralmente sem voto
- Preferência no reembolso de capital

### Estrutura Mínima
- **Assembleia Geral**: Órgão máximo
- **Diretoria**: Administração executiva
- **Conselho Fiscal**: Fiscalização (facultativo em fechada)
- **Conselho de Administração**: Órgão intermediário (obrigatório em aberta)

### Capital Social Mínimo
- S.A. Fechada: Sem mínimo legal
- S.A. Aberta: Conforme regulação CVM

---

## 5. Holding 🏢

### Descrição
Sociedade criada para deter participações em outras empresas, com finalidade de controle patrimonial, sucessório ou administrativo.

### Características Legais
- **Base Legal**: Código Civil (LTDA) ou Lei das S.A.
- **Natureza**: Geralmente LTDA ou S.A.
- **Finalidade**: Participação em outras sociedades
- **Tipos**: Pura ou Mista

### Campos Específicos

| Campo              | Tipo   | Obrigatório | Descrição                                    |
|--------------------|--------|-------------|----------------------------------------------|
| tipoHolding        | enum   | Sim         | 'pura' ou 'mista'                            |
| objetivoPrincipal  | enum   | Sim         | sucessorio, patrimonial, societaria, tributario, multiplo |
| empresasGrupo      | text   | Não         | Lista das empresas controladas/participadas  |

### Exemplo JSON
```json
{
  "tipoEntidade": "holding",
  "especificos": {
    "tipoHolding": "pura",
    "objetivoPrincipal": "sucessorio",
    "empresasGrupo": "Empresa A LTDA (CNPJ: 12.345.678/0001-90)\nEmpresa B LTDA (CNPJ: 98.765.432/0001-10)"
  }
}
```

### Tipos de Holding

**Holding Pura**
- Atividade exclusiva: participação em outras empresas
- Não exerce atividade operacional
- Foco em controle e administração

**Holding Mista**
- Participa de outras empresas
- Também exerce atividade operacional própria
- Diversificação de receitas

### Finalidades

**1. Planejamento Sucessório**
- Facilita transmissão de patrimônio
- Reduz custos com inventário
- Evita disputas familiares

**2. Proteção Patrimonial**
- Separação de patrimônio pessoal e empresarial
- Blindagem patrimonial
- Redução de riscos

**3. Planejamento Tributário**
- Otimização de carga tributária (dentro da lei)
- Isenção de dividendos
- Possibilidade de Simples Nacional (micro holding)

**4. Organização Societária**
- Centralização de controle
- Governança corporativa
- Facilita gestão de grupo empresarial

### Documentos Necessários
- [ ] Contrato Social ou Estatuto
- [ ] Documentos dos sócios/acionistas
- [ ] Comprovantes de participação nas empresas
- [ ] Laudos de avaliação (se integralização em bens)
- [ ] Acordo de sócios/acionistas

---

## 6. Sociedade Limitada (LTDA) 🏪

### Descrição
Tipo societário mais comum no Brasil, com responsabilidade limitada ao valor das quotas.

### Características Legais
- **Base Legal**: Código Civil, Art. 1.052 a 1.087
- **Capital**: Dividido em quotas
- **Responsabilidade**: Limitada (com exceções)
- **Registro**: Junta Comercial

### Campos Específicos

| Campo                | Tipo   | Obrigatório | Descrição                                    |
|----------------------|--------|-------------|----------------------------------------------|
| capitalSocial        | string | Sim         | Valor do capital social                      |
| formaIntegralizacao  | enum   | Sim         | 'dinheiro', 'bens', 'misto'                  |
| quorumAlteracoes     | text   | Não         | Quórum necessário para alterações            |

### Exemplo JSON
```json
{
  "tipoEntidade": "limitada",
  "especificos": {
    "capitalSocial": "R$ 100.000,00",
    "formaIntegralizacao": "dinheiro",
    "quorumAlteracoes": "Maioria absoluta do capital social (75%)"
  }
}
```

### Características Principais

**Capital Social**
- Sem valor mínimo legal
- Deve ser compatível com atividade
- Pode ser integralizado em dinheiro ou bens

**Quotas**
- Podem ser iguais ou desiguais
- Transferência depende de concordância dos sócios
- Direito de preferência dos sócios

**Administração**
- Por um ou mais administradores
- Sócios ou não sócios
- Poderes definidos no contrato social

**Responsabilidade**
- Limitada ao valor das quotas
- **Exceção**: Responsabilidade solidária pela integralização
- **Exceção**: Desconsideração da personalidade jurídica

### Vantagens
- Simplicidade de constituição
- Flexibilidade contratual
- Custos menores que S.A.
- Adequada para pequenas e médias empresas

---

## 7. Sociedade Simples 👔

### Descrição
Sociedade formada por pessoas que exercem profissão intelectual, de natureza científica, literária ou artística.

### Características Legais
- **Base Legal**: Código Civil, Art. 997 a 1.038
- **Natureza**: Não empresarial
- **Atividade**: Intelectual cooperativa
- **Registro**: Cartório de Registro Civil de Pessoas Jurídicas

### Atividades Típicas
- Advogados
- Médicos
- Dentistas
- Arquitetos
- Contadores
- Engenheiros
- Consultores

### Características
- Exercício de profissão regulamentada
- Atividade intelectual predominante
- Responsabilidade pode ser limitada ou ilimitada
- Não pode ser enquadrada no Simples Nacional

### Estrutura
```json
{
  "tipoEntidade": "simples",
  "especificos": {
    "profissao": "Advocacia",
    "conselhoClasse": "OAB/SP",
    "responsabilidade": "limitada"
  }
}
```

---

## Tabela Comparativa

| Característica          | Associação | OSCIP | SPE   | S.A.  | Holding | LTDA  | Simples |
|------------------------|------------|-------|-------|-------|---------|-------|---------|
| **Fins Lucrativos**     | Não        | Não   | Sim   | Sim   | Sim     | Sim   | Sim     |
| **Capital Mínimo**      | Não        | Não   | Não   | Não*  | Não     | Não   | Não     |
| **Simples Nacional**    | Não        | Não   | Sim** | Não   | Sim**   | Sim   | Não     |
| **Transferência Fácil** | N/A        | N/A   | Média | Alta  | Baixa   | Média | Baixa   |
| **Governança**          | Simples    | Média | Média | Alta  | Média   | Simples| Simples|
| **Registro**            | RCPJ       | RCPJ  | JC    | JC/CVM| JC      | JC    | RCPJ    |

*S.A. aberta tem regulação específica da CVM
**Depende de faturamento e atividade

---

## Escolha do Tipo Adequado

### Flowchart de Decisão

```
┌─────────────────────────────────┐
│   Tem finalidade lucrativa?     │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
   NÃO               SIM
    │                 │
    ▼                 ▼
┌─────────┐    ┌──────────────────┐
│Associação│    │ Projeto          │
│  OSCIP   │    │ específico?      │
└─────────┘    └────┬─────────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
         SIM                 NÃO
          │                   │
          ▼                   ▼
       ┌─────┐         ┌───────────┐
       │ SPE │         │ Porte da  │
       └─────┘         │ empresa?  │
                       └─────┬─────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
             Pequeno       Médio        Grande
                │            │            │
                ▼            ▼            ▼
             ┌────┐       ┌────┐      ┌─────┐
             │LTDA│       │LTDA│      │ S.A.│
             └────┘       │Hold│      │Hold │
                          └────┘      └─────┘
```

---

**Última atualização:** 2025-01-14
