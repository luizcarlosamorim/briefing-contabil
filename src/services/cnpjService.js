// ============================================
// Serviço de Consulta CNPJ - Infosimples API
// ============================================

const INFOSIMPLES_TOKEN = import.meta.env.VITE_INFOSIMPLES_TOKEN;
const INFOSIMPLES_URL = 'https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj';

/**
 * Consulta CNPJ diretamente na API Infosimples
 * @param {string} cnpj - CNPJ a ser consultado (com ou sem formatação)
 * @returns {Promise<Object>} Dados do CNPJ
 */
export const consultarCNPJ = async (cnpj) => {
  try {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');

    if (!INFOSIMPLES_TOKEN) {
      throw new Error('Token Infosimples não configurado. Configure VITE_INFOSIMPLES_TOKEN.');
    }

    console.log('🔍 Consultando CNPJ na Infosimples...');

    // Chamada direta à API Infosimples
    const response = await fetch(`${INFOSIMPLES_URL}?cnpj=${cnpjLimpo}&token=${INFOSIMPLES_TOKEN}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Verificar se a API retornou sucesso
    if (data.code !== 200) {
      throw new Error(data.message || data.code_message || 'Erro na consulta do CNPJ');
    }

    // Retornar dados formatados (mantendo compatibilidade com formato esperado)
    return formatarDadosInfosimples(data.data[0]);
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    throw error;
  }
};

/**
 * Formata os dados retornados da Infosimples para o formato esperado pelo sistema
 * Mantém compatibilidade com o formato que o useCNPJ.js espera
 */
const formatarDadosInfosimples = (dados) => {
  if (!dados) return null;

  return {
    // Dados básicos (formato esperado pelo useCNPJ)
    cnpj: dados.cnpj,
    nome: dados.razao_social,
    fantasia: dados.nome_fantasia || '',
    situacao: dados.situacao_cadastral,
    data_situacao: dados.data_situacao_cadastral,
    natureza_juridica: dados.natureza_juridica,
    data_abertura: dados.data_abertura,
    capital_social: dados.capital_social,
    porte: dados.porte,

    // Endereço (formato esperado)
    logradouro: dados.logradouro,
    numero: dados.numero,
    complemento: dados.complemento,
    bairro: dados.bairro,
    municipio: dados.municipio,
    uf: dados.uf,
    cep: dados.cep,

    // Contato
    email: dados.email,
    telefone: dados.telefone,

    // Atividades (formato esperado: array com objetos { text })
    atividade_principal: dados.atividade_principal ? [{
      code: dados.atividade_principal.codigo,
      text: dados.atividade_principal.descricao,
    }] : [],
    atividades_secundarias: (dados.atividades_secundarias || []).map(a => ({
      code: a.codigo,
      text: a.descricao,
    })),

    // QSA - Quadro de Sócios e Administradores (formato esperado)
    qsa: (dados.qsa || []).map((socio) => ({
      nome_socio: socio.nome,
      nome: socio.nome,
      qualificacao_socio: socio.qualificacao,
      qualificacao: socio.qualificacao,
      cpf_cnpj_socio: socio.cpf_cnpj || '',
    })),

    // Dados originais (para referência)
    _raw: dados,
  };
};

/**
 * Valida formato do CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} True se válido
 */
export const validarCNPJ = (cnpj) => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  return cnpjLimpo.length === 14;
};

/**
 * Formata CNPJ para exibição
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} CNPJ formatado (XX.XXX.XXX/XXXX-XX)
 */
export const formatarCNPJ = (cnpj) => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  if (cnpjLimpo.length !== 14) return cnpj;

  return cnpjLimpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

/**
 * Limpa formatação do CNPJ
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {string} CNPJ apenas com números
 */
export const limparCNPJ = (cnpj) => {
  return cnpj.replace(/[^\d]/g, '');
};
