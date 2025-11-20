import React, { createContext, useContext, useState } from 'react';

const BriefingContext = createContext(null);

export const useBriefing = () => {
  const context = useContext(BriefingContext);
  if (!context) {
    throw new Error('useBriefing must be used within BriefingProvider');
  }
  return context;
};

export const BriefingProvider = ({ children }) => {
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
      tipoImovel: 'proprio',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      cadastroImobiliario: ''
    },
    objetoSocial: '',
    capitalSocial: '',
    totalQuotas: '',
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

  // Atualizar dados de uma seção específica
  const atualizarDados = (secao, campo, valor) => {
    setDados(prev => ({
      ...prev,
      [secao]: typeof campo === 'string'
        ? { ...prev[secao], [campo]: valor }
        : campo // Se campo não for string, assume que é o objeto completo
    }));
  };

  // Gerenciamento de sócios
  const adicionarSocio = () => {
    const novoSocio = {
      id: Date.now(),
      nome: '',
      cpfCnpj: '',
      quotas: '',
      percentual: '',
      qualificacao: '',
      ehAdministrador: false,
      email: '',
      telefone: '',
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: ''
      }
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
    if (window.confirm('Deseja realmente remover este sócio?')) {
      setDados(prev => ({
        ...prev,
        socios: prev.socios.filter(socio => socio.id !== id)
      }));
    }
  };

  // Navegação entre etapas
  const proximaEtapa = () => {
    setEtapaAtual(prev => Math.min(prev + 1, 6));
  };

  const etapaAnterior = () => {
    setEtapaAtual(prev => Math.max(prev - 1, 0));
  };

  const irParaEtapa = (etapa) => {
    setEtapaAtual(etapa);
  };

  // Salvar progresso no localStorage
  const salvarProgresso = () => {
    try {
      localStorage.setItem('briefing_progresso', JSON.stringify({
        etapaAtual,
        tipoEntidade,
        dados,
        dataUltimoSalvamento: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      return false;
    }
  };

  // Carregar progresso do localStorage
  const carregarProgresso = () => {
    try {
      const progressoSalvo = localStorage.getItem('briefing_progresso');
      if (progressoSalvo) {
        const { etapaAtual: etapaSalva, tipoEntidade: tipoSalvo, dados: dadosSalvos } = JSON.parse(progressoSalvo);
        setEtapaAtual(etapaSalva || 0);
        setTipoEntidade(tipoSalvo || '');
        setDados(dadosSalvos || dados);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      return false;
    }
  };

  // Limpar progresso
  const limparProgresso = () => {
    localStorage.removeItem('briefing_progresso');
    setEtapaAtual(0);
    setTipoEntidade('');
    setDados({
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
  };

  const value = {
    // Estado
    etapaAtual,
    tipoEntidade,
    dados,

    // Setters
    setEtapaAtual,
    setTipoEntidade,
    setDados,

    // Funções
    atualizarDados,
    adicionarSocio,
    atualizarSocio,
    removerSocio,
    proximaEtapa,
    etapaAnterior,
    irParaEtapa,
    salvarProgresso,
    carregarProgresso,
    limparProgresso
  };

  return (
    <BriefingContext.Provider value={value}>
      {children}
    </BriefingContext.Provider>
  );
};
