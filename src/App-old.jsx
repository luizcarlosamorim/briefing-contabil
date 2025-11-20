import React, { useState, useEffect } from 'react';
import { FileText, Building2, Users, CheckCircle, AlertCircle, Download, Save } from 'lucide-react';

const BriefingContabil = () => {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [tipoEntidade, setTipoEntidade] = useState('');
  const [dados, setDados] = useState({
    dadosGerais: {
      nomeCliente: '',
      cpfCnpj: '',
      email: '',
      telefone: '',
      finalidade: 'abertura'
    },
    tipoEntidade: '',
    entidadeNome: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
      tipoImovel: 'proprio'
    },
    objetoSocial: '',
    faturamentoEstimado: '',
    inscricoes: {
      estadual: false,
      municipal: false,
      especial: false
    },
    socios: [],
    documentos: [],
    especificos: {}
  });

  const [buscandoCNPJ, setBuscandoCNPJ] = useState(false);
  const [cnpjEncontrado, setCnpjEncontrado] = useState(null);

  const tiposEntidade = [
    { valor: 'associacao', label: 'Associação Privada', icon: '🤝' },
    { valor: 'oscip', label: 'OSCIP / ONG', icon: '❤️' },
    { valor: 'spe', label: 'SPE - Sociedade de Propósito Específico', icon: '🎯' },
    { valor: 'sa', label: 'S.A. - Sociedade Anônima', icon: '📈' },
    { valor: 'holding', label: 'Holding', icon: '🏢' },
    { valor: 'limitada', label: 'Sociedade Limitada (LTDA)', icon: '🏪' },
    { valor: 'simples', label: 'Sociedade Simples', icon: '👔' }
  ];

  const etapas = [
    { id: 0, titulo: 'Dados Gerais', icon: FileText },
    { id: 1, titulo: 'Tipo de Entidade', icon: Building2 },
    { id: 2, titulo: 'Dados da Entidade', icon: Building2 },
    { id: 3, titulo: 'Sócios/Instituidores', icon: Users },
    { id: 4, titulo: 'Informações Específicas', icon: CheckCircle },
    { id: 5, titulo: 'Revisão Final', icon: Download }
  ];

  const estadosBrasileiros = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Função para limpar CNPJ (remover pontos, barras e hífens)
  const limparCNPJ = (cnpj) => {
    return cnpj.replace(/[^\d]/g, '');
  };

  // Função para validar CNPJ
  const validarCNPJ = (cnpj) => {
    const cnpjLimpo = limparCNPJ(cnpj);
    return cnpjLimpo.length === 14;
  };

  // Função para buscar dados do CNPJ usando API Infosimples (Profissional)
  const buscarDadosCNPJ = async (cnpj) => {
    const cnpjLimpo = limparCNPJ(cnpj);
    
    if (!validarCNPJ(cnpj)) {
      alert('⚠️ CNPJ inválido. Digite um CNPJ válido com 14 dígitos.');
      return;
    }

    setBuscandoCNPJ(true);
    setCnpjEncontrado(null);

    try {
      console.log('🔍 Consultando CNPJ via Infosimples API...');
      
      // API Infosimples - Consulta de CNPJ da Receita Federal
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
      
      console.log('📊 Resposta da API:', result);

      // Verificar código de resposta
      if (result.code !== 200) {
        let mensagemErro = 'Erro ao consultar CNPJ.';
        
        // Mensagens específicas baseadas no código de erro
        switch (result.code) {
          case 601:
            mensagemErro = 'Token de autenticação inválido.';
            break;
          case 603:
            mensagemErro = 'Token sem autorização para este serviço.';
            break;
          case 604:
            mensagemErro = 'CNPJ inválido.';
            break;
          case 605:
            mensagemErro = 'Tempo de consulta excedido. Tente novamente.';
            break;
          case 608:
            mensagemErro = 'CNPJ não encontrado ou inválido na Receita Federal.';
            break;
          case 612:
            mensagemErro = 'CNPJ não retornou dados na Receita Federal.';
            break;
          case 615:
            mensagemErro = 'Receita Federal temporariamente indisponível.';
            break;
          case 620:
            mensagemErro = result.errors?.[0] || 'Erro permanente na consulta.';
            break;
          default:
            mensagemErro = result.code_message || 'Erro desconhecido.';
        }
        
        if (result.errors && result.errors.length > 0) {
          mensagemErro += '\n\nDetalhes: ' + result.errors.join(', ');
        }
        
        alert(`❌ ${mensagemErro}\n\nCódigo: ${result.code}`);
        setBuscandoCNPJ(false);
        return;
      }

      // Verificar se retornou dados
      if (!result.data || result.data.length === 0) {
        alert('❌ Nenhum dado encontrado para este CNPJ.');
        setBuscandoCNPJ(false);
        return;
      }

      // Pegar o primeiro resultado (data é sempre array)
      const dadosCNPJ = result.data[0];
      
      console.log('✅ Dados do CNPJ obtidos com sucesso!');

      // Normalizar dados para o formato esperado
      const dadosNormalizados = {
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
        atividade_principal: dadosCNPJ.atividade_principal ? 
          [{ text: dadosCNPJ.atividade_principal }] : 
          (dadosCNPJ.cnae_fiscal_principal ? 
            [{ text: dadosCNPJ.cnae_fiscal_principal }] : []),
        atividades_secundarias: dadosCNPJ.atividades_secundarias || [],
        
        // Dados societários
        natureza_juridica: dadosCNPJ.natureza_juridica,
        capital_social: dadosCNPJ.capital_social,
        porte: dadosCNPJ.porte,
        
        // QSA (Quadro de Sócios e Administradores)
        qsa: dadosCNPJ.qsa || [],
        
        // Data de abertura
        data_abertura: dadosCNPJ.data_abertura,
        
        // Situação especial
        situacao_especial: dadosCNPJ.situacao_especial,
        data_situacao_especial: dadosCNPJ.data_situacao_especial,
        
        // Optantes
        opcao_simples: dadosCNPJ.opcao_simples,
        opcao_mei: dadosCNPJ.opcao_mei,
        
        // Dados extras
        header: result.header,
        site_receipts: result.site_receipts // PDFs e HTMLs da consulta
      };

      setCnpjEncontrado(dadosNormalizados);

      // Criar resumo para confirmação
      const resumo = `
✅ CNPJ encontrado na Receita Federal!

📋 DADOS DA EMPRESA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Razão Social: ${dadosNormalizados.nome}
${dadosNormalizados.fantasia ? `Nome Fantasia: ${dadosNormalizados.fantasia}\n` : ''}CNPJ: ${dadosNormalizados.cnpj}
Situação: ${dadosNormalizados.situacao}
${dadosNormalizados.data_situacao ? `Data Situação: ${dadosNormalizados.data_situacao}\n` : ''}
📍 ENDEREÇO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dadosNormalizados.logradouro}, ${dadosNormalizados.numero}
${dadosNormalizados.complemento ? `${dadosNormalizados.complemento}\n` : ''}${dadosNormalizados.bairro}
${dadosNormalizados.municipio}/${dadosNormalizados.uf}
CEP: ${dadosNormalizados.cep}

💼 ATIVIDADE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dadosNormalizados.atividade_principal?.[0]?.text || 'Não informado'}

${dadosNormalizados.capital_social ? `💰 Capital Social: R$ ${parseFloat(dadosNormalizados.capital_social).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` : ''}${dadosNormalizados.porte ? `📊 Porte: ${dadosNormalizados.porte}\n` : ''}${dadosNormalizados.natureza_juridica ? `🏛️ Natureza Jurídica: ${dadosNormalizados.natureza_juridica}\n` : ''}${dadosNormalizados.qsa?.length > 0 ? `\n👥 Sócios: ${dadosNormalizados.qsa.length} encontrado(s)\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deseja preencher automaticamente o formulário com estes dados?
      `.trim();

      const confirmacao = window.confirm(resumo);

      if (confirmacao) {
        preencherDadosCNPJ(dadosNormalizados);
      }

    } catch (error) {
      console.error('❌ Erro ao buscar CNPJ:', error);
      alert(
        '❌ Erro ao conectar com a API Infosimples.\n\n' +
        'Possíveis causas:\n' +
        '• Problema de conexão com a internet\n' +
        '• Servidor temporariamente indisponível\n' +
        '• Token inválido ou expirado\n\n' +
        'Detalhes técnicos: ' + error.message
      );
    } finally {
      setBuscandoCNPJ(false);
    }
  };

  // Função para preencher dados automaticamente
  const preencherDadosCNPJ = (dadosCNPJ) => {
    // Normalizar nome (diferentes APIs usam campos diferentes)
    const nomeEmpresa = dadosCNPJ.nome || dadosCNPJ.razao_social || '';
    const nomeFantasia = dadosCNPJ.fantasia || dadosCNPJ.nome_fantasia || '';
    
    // Preencher nome da entidade (preferir razão social)
    setDados(prev => ({
      ...prev,
      entidadeNome: nomeEmpresa || nomeFantasia,
      endereco: {
        logradouro: dadosCNPJ.logradouro || prev.endereco.logradouro,
        numero: dadosCNPJ.numero || prev.endereco.numero,
        complemento: dadosCNPJ.complemento || prev.endereco.complemento,
        bairro: dadosCNPJ.bairro || prev.endereco.bairro,
        cidade: dadosCNPJ.municipio || prev.endereco.cidade,
        uf: dadosCNPJ.uf || prev.endereco.uf,
        cep: dadosCNPJ.cep ? dadosCNPJ.cep.replace(/[^\d]/g, '') : prev.endereco.cep,
        tipoImovel: prev.endereco.tipoImovel
      },
      objetoSocial: dadosCNPJ.atividade_principal?.[0]?.text || 
                     dadosCNPJ.cnae_fiscal_descricao || 
                     prev.objetoSocial,
      dadosGerais: {
        ...prev.dadosGerais,
        nomeCliente: nomeEmpresa || nomeFantasia || prev.dadosGerais.nomeCliente,
        email: dadosCNPJ.email || prev.dadosGerais.email,
        telefone: dadosCNPJ.telefone || dadosCNPJ.ddd_telefone_1 || prev.dadosGerais.telefone
      }
    }));

    // Identificar tipo de entidade baseado na natureza jurídica
    const naturezaJuridica = (dadosCNPJ.natureza_juridica || '').toLowerCase();
    let tipoIdentificado = '';

    if (naturezaJuridica.includes('associação') || naturezaJuridica.includes('associacao')) {
      tipoIdentificado = 'associacao';
    } else if (naturezaJuridica.includes('sociedade anônima') || 
               naturezaJuridica.includes('sociedade anonima') || 
               naturezaJuridica.includes('s/a') ||
               naturezaJuridica.includes('s.a')) {
      tipoIdentificado = 'sa';
    } else if (naturezaJuridica.includes('limitada') || naturezaJuridica.includes('ltda')) {
      tipoIdentificado = 'limitada';
    } else if (naturezaJuridica.includes('simples')) {
      tipoIdentificado = 'simples';
    } else if (naturezaJuridica.includes('holding')) {
      tipoIdentificado = 'holding';
    }

    if (tipoIdentificado) {
      setDados(prev => ({ ...prev, tipoEntidade: tipoIdentificado }));
      setTipoEntidade(tipoIdentificado);
    }

    // Preencher sócios se disponível
    if (dadosCNPJ.qsa && dadosCNPJ.qsa.length > 0) {
      // Normalizar estrutura de sócios (APIs diferentes usam formatos diferentes)
      const sociosImportados = dadosCNPJ.qsa.map((socio, index) => {
        // BrasilAPI
        const nomeSocio = socio.nome_socio || socio.nome || '';
        const qualSocio = socio.qualificacao_socio?.descricao || 
                         socio.qual || 
                         socio.cargo || '';
        
        // Tentar extrair percentual de participação
        let participacao = '';
        const matchPerc = qualSocio.match(/(\d+(?:[,.]\d+)?)\s*%/);
        if (matchPerc) {
          participacao = matchPerc[1].replace(',', '.');
        }

        return {
          id: Date.now() + index,
          tipo: 'pf',
          nome: nomeSocio,
          cpfCnpj: '',
          rg: '',
          estadoCivil: '',
          regimeBens: '',
          endereco: '',
          email: '',
          telefone: '',
          participacao: participacao,
          administrador: qualSocio.toLowerCase().includes('administrador') || 
                        qualSocio.toLowerCase().includes('diretor') ||
                        qualSocio.toLowerCase().includes('gerente'),
          restricoes: 'nao'
        };
      });

      const confirmarSocios = window.confirm(
        `Encontramos ${sociosImportados.length} sócio(s) no CNPJ.\n\n` +
        sociosImportados.slice(0, 3).map((s, i) => `${i + 1}. ${s.nome}`).join('\n') +
        (sociosImportados.length > 3 ? `\n... e mais ${sociosImportados.length - 3}` : '') +
        `\n\nDeseja importar os dados dos sócios?`
      );

      if (confirmarSocios) {
        setDados(prev => ({ ...prev, socios: sociosImportados }));
      }
    }

    alert('✅ Dados importados com sucesso! Revise e complete as informações necessárias.');
  };

  const atualizarDados = (secao, campo, valor) => {
    setDados(prev => ({
      ...prev,
      [secao]: typeof prev[secao] === 'object' && !Array.isArray(prev[secao])
        ? { ...prev[secao], [campo]: valor }
        : valor
    }));
  };

  const adicionarSocio = () => {
    const novoSocio = {
      id: Date.now(),
      tipo: 'pf',
      nome: '',
      cpfCnpj: '',
      rg: '',
      estadoCivil: '',
      regimeBens: '',
      endereco: '',
      email: '',
      telefone: '',
      participacao: '',
      administrador: false,
      restricoes: 'nao'
    };
    setDados(prev => ({
      ...prev,
      socios: [...prev.socios, novoSocio]
    }));
  };

  const atualizarSocio = (id, campo, valor) => {
    setDados(prev => ({
      ...prev,
      socios: prev.socios.map(socio => 
        socio.id === id ? { ...socio, [campo]: valor } : socio
      )
    }));
  };

  const removerSocio = (id) => {
    setDados(prev => ({
      ...prev,
      socios: prev.socios.filter(socio => socio.id !== id)
    }));
  };

  const gerarRelatorio = () => {
    const relatorio = `
═══════════════════════════════════════════════════════════
    BRIEFING CONTÁBIL - ABERTURA DE ENTIDADE
═══════════════════════════════════════════════════════════

📋 DADOS GERAIS DO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome/Razão Social: ${dados.dadosGerais.nomeCliente}
CPF/CNPJ: ${dados.dadosGerais.cpfCnpj}
E-mail: ${dados.dadosGerais.email}
Telefone: ${dados.dadosGerais.telefone}
Finalidade: ${dados.dadosGerais.finalidade.toUpperCase()}

🏢 TIPO DE ENTIDADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo Escolhido: ${tiposEntidade.find(t => t.valor === dados.tipoEntidade)?.label || 'Não definido'}
Nome da Entidade: ${dados.entidadeNome}

📍 ENDEREÇO DA SEDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.endereco.logradouro}, ${dados.endereco.numero}
${dados.endereco.complemento ? `${dados.endereco.complemento}\n` : ''}${dados.endereco.bairro}
${dados.endereco.cidade} - ${dados.endereco.uf}
CEP: ${dados.endereco.cep}
Tipo de Imóvel: ${dados.endereco.tipoImovel.toUpperCase()}

📝 OBJETO SOCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.objetoSocial}

💰 INFORMAÇÕES FINANCEIRAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Faturamento Estimado: ${dados.faturamentoEstimado}

📋 INSCRIÇÕES NECESSÁRIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Inscrição Estadual: ${dados.inscricoes.estadual ? '✓ SIM' : '✗ NÃO'}
Inscrição Municipal: ${dados.inscricoes.municipal ? '✓ SIM' : '✗ NÃO'}
Inscrições Especiais: ${dados.inscricoes.especial ? '✓ SIM' : '✗ NÃO'}

👥 SÓCIOS / INSTITUIDORES (${dados.socios.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.socios.map((socio, index) => `
${index + 1}. ${socio.nome}
   Tipo: ${socio.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
   CPF/CNPJ: ${socio.cpfCnpj}
   ${socio.tipo === 'pf' ? `RG: ${socio.rg}\n   Estado Civil: ${socio.estadoCivil}\n   Regime de Bens: ${socio.regimeBens}` : ''}
   E-mail: ${socio.email}
   Telefone: ${socio.telefone}
   Participação: ${socio.participacao}%
   Administrador: ${socio.administrador ? 'SIM' : 'NÃO'}
   Restrições: ${socio.restricoes.toUpperCase()}
`).join('\n')}

${gerarSecaoEspecifica()}

═══════════════════════════════════════════════════════════
Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
Sistema: Briefing Contábil Dinâmico v1.0
═══════════════════════════════════════════════════════════
    `;
    
    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefing-${dados.dadosGerais.nomeCliente.replace(/\s/g, '-')}-${Date.now()}.txt`;
    a.click();
  };

  const gerarSecaoEspecifica = () => {
    switch (dados.tipoEntidade) {
      case 'associacao':
      case 'oscip':
        return `
🤝 INFORMAÇÕES ESPECÍFICAS - ASSOCIAÇÃO/OSCIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Finalidade Principal: ${dados.especificos.finalidadePrincipal || 'Não informado'}
Possui Conselho Fiscal: ${dados.especificos.conselhoFiscal ? 'SIM' : 'NÃO'}
Possui Conselho Deliberativo: ${dados.especificos.conselhoDeliberativo ? 'SIM' : 'NÃO'}
Membros da Diretoria: ${dados.especificos.membrosDiretoria || 'Não informado'}
Mandato: ${dados.especificos.mandato || 'Não informado'} anos
Remuneração de Dirigentes: ${dados.especificos.remuneracaoDirigentes ? 'SIM' : 'NÃO'}
Cobrança de Mensalidade: ${dados.especificos.mensalidade ? 'SIM' : 'NÃO'}
`;
      case 'spe':
        return `
🎯 INFORMAÇÕES ESPECÍFICAS - SPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Finalidade do Projeto: ${dados.especificos.finalidadeProjeto || 'Não informado'}
Prazo do Projeto: ${dados.especificos.prazoProjeto || 'Não informado'}
Investimento Total: ${dados.especificos.investimentoTotal || 'Não informado'}
Regras de Saída: ${dados.especificos.regrasSaida || 'Não informado'}
Destino do Patrimônio: ${dados.especificos.destinoPatrimonio || 'Não informado'}
`;
      case 'sa':
        return `
📈 INFORMAÇÕES ESPECÍFICAS - S.A.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo: ${dados.especificos.tipoSA || 'Não informado'}
Capital Social: ${dados.especificos.capitalSocial || 'Não informado'}
Número de Ações: ${dados.especificos.numeroAcoes || 'Não informado'}
Classes de Ações: ${dados.especificos.classesAcoes || 'Não informado'}
Acordo de Acionistas: ${dados.especificos.acordoAcionistas ? 'SIM' : 'NÃO'}
Conselho de Administração: ${dados.especificos.conselhoAdministracao ? 'SIM' : 'NÃO'}
`;
      case 'holding':
        return `
🏢 INFORMAÇÕES ESPECÍFICAS - HOLDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo de Holding: ${dados.especificos.tipoHolding || 'Não informado'}
Objetivo Principal: ${dados.especificos.objetivoPrincipal || 'Não informado'}
Empresas do Grupo: ${dados.especificos.empresasGrupo || 'Não informado'}
`;
      case 'limitada':
        return `
🏪 INFORMAÇÕES ESPECÍFICAS - LTDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Capital Social: ${dados.especificos.capitalSocial || 'Não informado'}
Forma de Integralização: ${dados.especificos.formaIntegralizacao || 'Não informado'}
Quórum para Alterações: ${dados.especificos.quorumAlteracoes || 'Não informado'}
`;
      default:
        return '';
    }
  };

  const salvarProgresso = () => {
    localStorage.setItem('briefing-contabil', JSON.stringify(dados));
    alert('✅ Progresso salvo com sucesso!');
  };

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('briefing-contabil');
    if (dadosSalvos) {
      const confirmacao = window.confirm('Encontramos um briefing salvo. Deseja continuar de onde parou?');
      if (confirmacao) {
        setDados(JSON.parse(dadosSalvos));
      }
    }
  }, []);

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Dados Gerais do Cliente</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo / Razão Social *
              </label>
              <input
                type="text"
                value={dados.dadosGerais.nomeCliente}
                onChange={(e) => atualizarDados('dadosGerais', 'nomeCliente', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o nome completo ou razão social"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF / CNPJ *
                </label>
                <input
                  type="text"
                  value={dados.dadosGerais.cpfCnpj}
                  onChange={(e) => atualizarDados('dadosGerais', 'cpfCnpj', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={dados.dadosGerais.telefone}
                  onChange={(e) => atualizarDados('dadosGerais', 'telefone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                value={dados.dadosGerais.email}
                onChange={(e) => atualizarDados('dadosGerais', 'email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Finalidade da Consulta *
              </label>
              <select
                value={dados.dadosGerais.finalidade}
                onChange={(e) => atualizarDados('dadosGerais', 'finalidade', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="abertura">Abertura de nova entidade</option>
                <option value="regularizacao">Regularização / Alteração</option>
                <option value="viabilidade">Estudo de viabilidade</option>
              </select>
            </div>

            {/* Seção de Busca de CNPJ - Aparece apenas se finalidade for regularização/alteração */}
            {(dados.dadosGerais.finalidade === 'regularizacao' || dados.dadosGerais.finalidade === 'viabilidade') && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 mt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      🔍 Busca Automática de CNPJ
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Se você já possui um CNPJ cadastrado, podemos buscar automaticamente os dados na Receita Federal e preencher o formulário para você!
                    </p>
                    
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={dados.dadosGerais.cpfCnpj}
                        onChange={(e) => atualizarDados('dadosGerais', 'cpfCnpj', e.target.value)}
                        className="flex-1 p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite o CNPJ: 00.000.000/0000-00"
                        maxLength="18"
                      />
                      <button
                        onClick={() => buscarDadosCNPJ(dados.dadosGerais.cpfCnpj)}
                        disabled={buscandoCNPJ || !dados.dadosGerais.cpfCnpj}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-semibold"
                      >
                        {buscandoCNPJ ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Buscando...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            <span>Buscar</span>
                          </>
                        )}
                      </button>
                    </div>

                    {cnpjEncontrado && (
                      <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                              ✅ CNPJ Encontrado na Receita Federal!
                              <span className="ml-2 text-xs bg-green-200 px-2 py-1 rounded">Infosimples API</span>
                            </h4>
                            <div className="text-sm text-green-700 space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold">Razão Social:</p>
                                  <p>{cnpjEncontrado.nome || 'N/A'}</p>
                                </div>
                                {cnpjEncontrado.fantasia && (
                                  <div>
                                    <p className="font-semibold">Nome Fantasia:</p>
                                    <p>{cnpjEncontrado.fantasia}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-green-200">
                                <div>
                                  <p className="font-semibold">CNPJ:</p>
                                  <p>{cnpjEncontrado.cnpj}</p>
                                </div>
                                <div>
                                  <p className="font-semibold">Situação:</p>
                                  <p className={cnpjEncontrado.situacao?.toLowerCase().includes('ativa') ? 'text-green-800 font-semibold' : 'text-red-700 font-semibold'}>
                                    {cnpjEncontrado.situacao || 'N/A'}
                                  </p>
                                </div>
                                {cnpjEncontrado.porte && (
                                  <div>
                                    <p className="font-semibold">Porte:</p>
                                    <p>{cnpjEncontrado.porte}</p>
                                  </div>
                                )}
                              </div>

                              {cnpjEncontrado.atividade_principal?.[0]?.text && (
                                <div className="pt-2 border-t border-green-200">
                                  <p className="font-semibold">Atividade Principal:</p>
                                  <p className="text-xs">{cnpjEncontrado.atividade_principal[0].text}</p>
                                </div>
                              )}

                              {cnpjEncontrado.logradouro && (
                                <div className="pt-2 border-t border-green-200">
                                  <p className="font-semibold">Endereço:</p>
                                  <p className="text-xs">
                                    {cnpjEncontrado.logradouro}, {cnpjEncontrado.numero}
                                    {cnpjEncontrado.complemento && ` - ${cnpjEncontrado.complemento}`}
                                    <br />
                                    {cnpjEncontrado.bairro} - {cnpjEncontrado.municipio}/{cnpjEncontrado.uf}
                                    <br />
                                    CEP: {cnpjEncontrado.cep}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-green-200">
                                {cnpjEncontrado.capital_social && (
                                  <div>
                                    <p className="font-semibold">Capital Social:</p>
                                    <p>R$ {parseFloat(cnpjEncontrado.capital_social).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                )}
                                {cnpjEncontrado.data_abertura && (
                                  <div>
                                    <p className="font-semibold">Data Abertura:</p>
                                    <p>{cnpjEncontrado.data_abertura}</p>
                                  </div>
                                )}
                              </div>

                              {cnpjEncontrado.natureza_juridica && (
                                <div className="pt-2 border-t border-green-200">
                                  <p className="font-semibold">Natureza Jurídica:</p>
                                  <p className="text-xs">{cnpjEncontrado.natureza_juridica}</p>
                                </div>
                              )}

                              {cnpjEncontrado.qsa && cnpjEncontrado.qsa.length > 0 && (
                                <div className="pt-2 border-t border-green-200">
                                  <p className="font-semibold">Quadro Societário:</p>
                                  <p className="text-xs">{cnpjEncontrado.qsa.length} sócio(s) ou administrador(es) encontrado(s)</p>
                                </div>
                              )}

                              {(cnpjEncontrado.opcao_simples || cnpjEncontrado.opcao_mei) && (
                                <div className="pt-2 border-t border-green-200">
                                  <p className="font-semibold">Enquadramento:</p>
                                  <div className="flex gap-2 mt-1">
                                    {cnpjEncontrado.opcao_simples && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Simples Nacional</span>
                                    )}
                                    {cnpjEncontrado.opcao_mei && (
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">MEI</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {cnpjEncontrado.site_receipts && cnpjEncontrado.site_receipts.length > 0 && (
                                <div className="pt-2 border-t border-green-200">
                                  <p className="font-semibold mb-1">Comprovantes:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {cnpjEncontrado.site_receipts.map((url, index) => (
                                      <a 
                                        key={index}
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                      >
                                        📄 Visualizar Consulta #{index + 1}
                                      </a>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    ⏰ Disponíveis por 7 dias
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 text-xs text-gray-600">
                      <p>💡 <strong>Dica:</strong> A busca utiliza dados públicos da Receita Federal.</p>
                      <p>⚠️ Revise sempre os dados importados antes de finalizar.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏢 Selecione o Tipo de Entidade</h2>
            <p className="text-gray-600 mb-6">
              Escolha o tipo de estrutura jurídica que deseja constituir:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposEntidade.map((tipo) => (
                <button
                  key={tipo.valor}
                  onClick={() => {
                    setDados(prev => ({ ...prev, tipoEntidade: tipo.valor }));
                    setTipoEntidade(tipo.valor);
                  }}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    dados.tipoEntidade === tipo.valor
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-3">{tipo.icon}</div>
                  <div className="text-lg font-semibold text-gray-800">{tipo.label}</div>
                </button>
              ))}
            </div>

            {dados.tipoEntidade && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">
                  ✓ Selecionado: {tiposEntidade.find(t => t.valor === dados.tipoEntidade)?.label}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏢 Dados da Entidade</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Empresarial / Denominação *
              </label>
              <input
                type="text"
                value={dados.entidadeNome}
                onChange={(e) => setDados(prev => ({ ...prev, entidadeNome: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nome da empresa/entidade"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-4">📍 Endereço da Sede</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro *</label>
                  <input
                    type="text"
                    value={dados.endereco.logradouro}
                    onChange={(e) => atualizarDados('endereco', 'logradouro', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
                  <input
                    type="text"
                    value={dados.endereco.numero}
                    onChange={(e) => atualizarDados('endereco', 'numero', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                  <input
                    type="text"
                    value={dados.endereco.complemento}
                    onChange={(e) => atualizarDados('endereco', 'complemento', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Sala, Andar, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
                  <input
                    type="text"
                    value={dados.endereco.bairro}
                    onChange={(e) => atualizarDados('endereco', 'bairro', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nome do bairro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
                  <input
                    type="text"
                    value={dados.endereco.cidade}
                    onChange={(e) => atualizarDados('endereco', 'cidade', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UF *</label>
                  <select
                    value={dados.endereco.uf}
                    onChange={(e) => atualizarDados('endereco', 'uf', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione</option>
                    {estadosBrasileiros.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP *</label>
                  <input
                    type="text"
                    value={dados.endereco.cep}
                    onChange={(e) => atualizarDados('endereco', 'cep', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Imóvel *</label>
                <select
                  value={dados.endereco.tipoImovel}
                  onChange={(e) => atualizarDados('endereco', 'tipoImovel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="proprio">Próprio</option>
                  <option value="alugado">Alugado</option>
                  <option value="coworking">Coworking</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Objeto Social / Atividades Principais *
              </label>
              <textarea
                value={dados.objetoSocial}
                onChange={(e) => setDados(prev => ({ ...prev, objetoSocial: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Descreva as atividades principais que serão realizadas..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Previsão de Faturamento Inicial
              </label>
              <select
                value={dados.faturamentoEstimado}
                onChange={(e) => setDados(prev => ({ ...prev, faturamentoEstimado: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione uma faixa</option>
                <option value="ate-81k">Até R$ 81.000/ano (MEI)</option>
                <option value="81k-360k">R$ 81.000 a R$ 360.000/ano</option>
                <option value="360k-4.8mi">R$ 360.000 a R$ 4.8 milhões/ano</option>
                <option value="acima-4.8mi">Acima de R$ 4.8 milhões/ano</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">📋 Inscrições Necessárias</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={dados.inscricoes.estadual}
                    onChange={(e) => atualizarDados('inscricoes', 'estadual', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span>Inscrição Estadual</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={dados.inscricoes.municipal}
                    onChange={(e) => atualizarDados('inscricoes', 'municipal', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span>Inscrição Municipal</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={dados.inscricoes.especial}
                    onChange={(e) => atualizarDados('inscricoes', 'especial', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span>Inscrições Especiais (CEBAS, etc.)</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">👥 Sócios / Instituidores</h2>
              <button
                onClick={adicionarSocio}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                + Adicionar Sócio
              </button>
            </div>

            {dados.socios.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Nenhum sócio adicionado ainda</p>
                <button
                  onClick={adicionarSocio}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Adicionar Primeiro Sócio
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dados.socios.map((socio, index) => (
                  <div key={socio.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Sócio #{index + 1}
                      </h3>
                      <button
                        onClick={() => removerSocio(socio.id)}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Remover
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                        <select
                          value={socio.tipo}
                          onChange={(e) => atualizarSocio(socio.id, 'tipo', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="pf">Pessoa Física</option>
                          <option value="pj">Pessoa Jurídica</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {socio.tipo === 'pf' ? 'CPF' : 'CNPJ'} *
                        </label>
                        <input
                          type="text"
                          value={socio.cpfCnpj}
                          onChange={(e) => atualizarSocio(socio.id, 'cpfCnpj', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder={socio.tipo === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {socio.tipo === 'pf' ? 'Nome Completo' : 'Razão Social'} *
                      </label>
                      <input
                        type="text"
                        value={socio.nome}
                        onChange={(e) => atualizarSocio(socio.id, 'nome', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {socio.tipo === 'pf' && (
                      <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">RG</label>
                            <input
                              type="text"
                              value={socio.rg}
                              onChange={(e) => atualizarSocio(socio.id, 'rg', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil</label>
                            <select
                              value={socio.estadoCivil}
                              onChange={(e) => atualizarSocio(socio.id, 'estadoCivil', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">Selecione</option>
                              <option value="solteiro">Solteiro(a)</option>
                              <option value="casado">Casado(a)</option>
                              <option value="divorciado">Divorciado(a)</option>
                              <option value="viuvo">Viúvo(a)</option>
                              <option value="uniao-estavel">União Estável</option>
                            </select>
                          </div>
                        </div>

                        {(socio.estadoCivil === 'casado' || socio.estadoCivil === 'uniao-estavel') && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Regime de Bens</label>
                            <select
                              value={socio.regimeBens}
                              onChange={(e) => atualizarSocio(socio.id, 'regimeBens', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">Selecione</option>
                              <option value="comunhao-parcial">Comunhão Parcial de Bens</option>
                              <option value="comunhao-universal">Comunhão Universal de Bens</option>
                              <option value="separacao-total">Separação Total de Bens</option>
                              <option value="participacao-final">Participação Final nos Aquestos</option>
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                        <input
                          type="email"
                          value={socio.email}
                          onChange={(e) => atualizarSocio(socio.id, 'email', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input
                          type="tel"
                          value={socio.telefone}
                          onChange={(e) => atualizarSocio(socio.id, 'telefone', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Participação (%) *
                        </label>
                        <input
                          type="number"
                          value={socio.participacao}
                          onChange={(e) => atualizarSocio(socio.id, 'participacao', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Restrições</label>
                        <select
                          value={socio.restricoes}
                          onChange={(e) => atualizarSocio(socio.id, 'restricoes', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="nao">Não</option>
                          <option value="sim">Sim</option>
                          <option value="nao-sabe">Não sabe</option>
                        </select>
                      </div>
                    </div>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={socio.administrador}
                        onChange={(e) => atualizarSocio(socio.id, 'administrador', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="font-medium text-gray-700">Será administrador da entidade</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {dados.socios.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-800">
                  Total de participação: {dados.socios.reduce((sum, s) => sum + (parseFloat(s.participacao) || 0), 0).toFixed(2)}%
                </p>
                {dados.socios.reduce((sum, s) => sum + (parseFloat(s.participacao) || 0), 0) !== 100 && (
                  <p className="text-sm text-blue-700 mt-1">
                    ⚠️ A soma das participações deve totalizar 100%
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return renderEspecificos();

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">✅ Revisão Final</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo do Briefing</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Cliente</h4>
                  <p className="text-gray-600">{dados.dadosGerais.nomeCliente}</p>
                  <p className="text-sm text-gray-500">{dados.dadosGerais.cpfCnpj}</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Tipo de Entidade</h4>
                  <p className="text-gray-600">
                    {tiposEntidade.find(t => t.valor === dados.tipoEntidade)?.label || 'Não selecionado'}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Nome da Entidade</h4>
                  <p className="text-gray-600">{dados.entidadeNome || 'Não informado'}</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Número de Sócios</h4>
                  <p className="text-gray-600">{dados.socios.length} sócio(s) cadastrado(s)</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Endereço</h4>
                  <p className="text-gray-600">
                    {dados.endereco.cidade} - {dados.endereco.uf}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Importante - Próximos Passos</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Verifique todos os dados antes de gerar o relatório</li>
                    <li>• O relatório será baixado em formato TXT</li>
                    <li>• Providencie os documentos complementares necessários</li>
                    <li>• Consulte um profissional habilitado (CRC/OAB) para validação</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={gerarRelatorio}
                className="flex-1 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-semibold text-lg"
              >
                <Download className="w-6 h-6" />
                <span>Gerar Relatório Completo</span>
              </button>
              
              <button
                onClick={salvarProgresso}
                className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderEspecificos = () => {
    switch (dados.tipoEntidade) {
      case 'associacao':
      case 'oscip':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🤝 Informações Específicas - {dados.tipoEntidade === 'associacao' ? 'Associação' : 'OSCIP'}
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Finalidade Principal *
              </label>
              <select
                value={dados.especificos.finalidadePrincipal || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, finalidadePrincipal: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="cultural">Cultural</option>
                <option value="esportiva">Esportiva</option>
                <option value="religiosa">Religiosa</option>
                <option value="educacao">Educação</option>
                <option value="saude">Saúde</option>
                <option value="assistencia-social">Assistência Social</option>
                <option value="outra">Outra</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Membros na Diretoria
                </label>
                <input
                  type="number"
                  value={dados.especificos.membrosDiretoria || ''}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, membrosDiretoria: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mandato (em anos)
                </label>
                <input
                  type="number"
                  value={dados.especificos.mandato || ''}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, mandato: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dados.especificos.conselhoFiscal || false}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, conselhoFiscal: e.target.checked }
                  }))}
                  className="w-5 h-5"
                />
                <span className="font-medium">Terá Conselho Fiscal</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dados.especificos.conselhoDeliberativo || false}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, conselhoDeliberativo: e.target.checked }
                  }))}
                  className="w-5 h-5"
                />
                <span className="font-medium">Terá Conselho Deliberativo</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dados.especificos.remuneracaoDirigentes || false}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, remuneracaoDirigentes: e.target.checked }
                  }))}
                  className="w-5 h-5"
                />
                <span className="font-medium">Haverá Remuneração de Dirigentes</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dados.especificos.mensalidade || false}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, mensalidade: e.target.checked }
                  }))}
                  className="w-5 h-5"
                />
                <span className="font-medium">Cobrará Mensalidade/Contribuição</span>
              </label>
            </div>
          </div>
        );

      case 'spe':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Informações Específicas - SPE</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Finalidade Específica do Projeto *
              </label>
              <textarea
                value={dados.especificos.finalidadeProjeto || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, finalidadeProjeto: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Ex: Construção de empreendimento imobiliário, execução de PPP, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prazo Estimado do Projeto
                </label>
                <input
                  type="text"
                  value={dados.especificos.prazoProjeto || ''}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, prazoProjeto: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Ex: 24 meses"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investimento Total Previsto
                </label>
                <input
                  type="text"
                  value={dados.especificos.investimentoTotal || ''}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, investimentoTotal: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Regras de Saída de Sócios
              </label>
              <textarea
                value={dados.especificos.regrasSaida || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, regrasSaida: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destino do Patrimônio ao Fim da SPE
              </label>
              <textarea
                value={dados.especificos.destinoPatrimonio || ''}
                onChange={(e) => setDados(prev => ({
                    ...prev,
                  especificos: { ...prev.especificos, destinoPatrimonio: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="2"
              />
            </div>
          </div>
        );

      case 'sa':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Informações Específicas - S.A.</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de S.A. *
              </label>
              <select
                value={dados.especificos.tipoSA || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, tipoSA: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="fechada">S.A. Fechada</option>
                <option value="aberta">S.A. Aberta (com registro na CVM)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capital Social Inicial *
                </label>
                <input
                  type="text"
                  value={dados.especificos.capitalSocial || ''}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, capitalSocial: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="R$ 0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Ações
                </label>
                <input
                  type="number"
                  value={dados.especificos.numeroAcoes || ''}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, numeroAcoes: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Classes de Ações
              </label>
              <select
                value={dados.especificos.classesAcoes || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, classesAcoes: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="ordinarias">Apenas Ordinárias (ON)</option>
                <option value="preferenciais">Apenas Preferenciais (PN)</option>
                <option value="ambas">Ordinárias e Preferenciais</option>
              </select>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dados.especificos.acordoAcionistas || false}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, acordoAcionistas: e.target.checked }
                  }))}
                  className="w-5 h-5"
                />
                <span className="font-medium">Existirá Acordo de Acionistas</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dados.especificos.conselhoAdministracao || false}
                  onChange={(e) => setDados(prev => ({
                    ...prev,
                    especificos: { ...prev.especificos, conselhoAdministracao: e.target.checked }
                  }))}
                  className="w-5 h-5"
                />
                <span className="font-medium">Terá Conselho de Administração</span>
              </label>
            </div>
          </div>
        );

      case 'holding':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏢 Informações Específicas - Holding</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Holding *
              </label>
              <select
                value={dados.especificos.tipoHolding || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, tipoHolding: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="pura">Holding Pura (apenas participa de outras empresas)</option>
                <option value="mista">Holding Mista (participa e exerce atividade operacional)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Objetivo Principal *
              </label>
              <select
                value={dados.especificos.objetivoPrincipal || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, objetivoPrincipal: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="sucessorio">Planejamento Sucessório</option>
                <option value="patrimonial">Proteção Patrimonial</option>
                <option value="societaria">Organização Societária do Grupo</option>
                <option value="tributario">Planejamento Tributário</option>
                <option value="multiplo">Múltiplos Objetivos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Empresas que Farão Parte do Grupo
              </label>
              <textarea
                value={dados.especificos.empresasGrupo || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, empresasGrupo: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Liste as empresas que serão controladas pela holding..."
              />
            </div>
          </div>
        );

      case 'limitada':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏪 Informações Específicas - LTDA</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Capital Social *
              </label>
              <input
                type="text"
                value={dados.especificos.capitalSocial || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, capitalSocial: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Forma de Integralização *
              </label>
              <select
                value={dados.especificos.formaIntegralizacao || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, formaIntegralizacao: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="bens">Bens</option>
                <option value="misto">Dinheiro e Bens</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quórum para Decisões Importantes
              </label>
              <textarea
                value={dados.especificos.quorumAlteracoes || ''}
                onChange={(e) => setDados(prev => ({
                  ...prev,
                  especificos: { ...prev.especificos, quorumAlteracoes: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Ex: Maioria simples, 75% do capital, unanimidade, etc."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Selecione um tipo de entidade para ver informações específicas</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Briefing Contábil Dinâmico
          </h1>
          <p className="text-gray-600">
            Sistema completo para coleta de informações para abertura de entidades
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {etapas.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      etapaAtual >= index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {etapaAtual > index ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <etapa.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center font-medium">
                    {etapa.titulo}
                  </span>
                </div>
                {index < etapas.length - 1 && (
                  <div
                    className={`h-1 flex-1 ${
                      etapaAtual > index ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {renderEtapa()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setEtapaAtual(Math.max(0, etapaAtual - 1))}
            disabled={etapaAtual === 0}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Voltar
          </button>

          {etapaAtual < etapas.length - 1 ? (
            <button
              onClick={() => setEtapaAtual(Math.min(etapas.length - 1, etapaAtual + 1))}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Próximo →
            </button>
          ) : null}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Sistema desenvolvido para contadores e consultores empresariais</p>
          <p className="mt-1">⚠️ Consulte sempre um profissional habilitado (CRC/OAB) para validação final</p>
        </div>
      </div>
    </div>
  );
};

export default BriefingContabil;