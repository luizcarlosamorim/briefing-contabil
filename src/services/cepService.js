/**
 * Serviço para consulta de CEP usando a API ViaCEP
 * API pública e gratuita para consulta de CEPs brasileiros
 */

/**
 * Valida se o CEP possui formato válido
 * @param {string} cep - CEP com ou sem formatação
 * @returns {boolean}
 */
export const validarCEP = (cep) => {
  if (!cep) return false;

  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');

  // Verifica se tem 8 dígitos
  return cepLimpo.length === 8;
};

/**
 * Formata o CEP para o padrão XXXXX-XXX
 * @param {string} cep - CEP sem formatação
 * @returns {string}
 */
export const formatarCEP = (cep) => {
  if (!cep) return '';

  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) return cep;

  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Consulta dados do CEP na API ViaCEP
 * @param {string} cep - CEP com ou sem formatação
 * @returns {Promise<Object>} Dados do endereço
 */
export const consultarCEP = async (cep) => {
  if (!validarCEP(cep)) {
    throw new Error('CEP inválido. Digite um CEP válido com 8 dígitos.');
  }

  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');

  try {
    console.log('🔍 Consultando CEP:', cepLimpo);

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
      throw new Error('Erro ao consultar CEP. Tente novamente.');
    }

    const dados = await response.json();

    // ViaCEP retorna erro: true quando o CEP não existe
    if (dados.erro) {
      throw new Error('CEP não encontrado. Verifique o CEP digitado.');
    }

    console.log('✅ CEP encontrado:', dados.logradouro);

    // Normaliza os dados para o formato esperado pelo sistema
    return {
      cep: formatarCEP(cepLimpo),
      logradouro: dados.logradouro || '',
      complemento: dados.complemento || '',
      bairro: dados.bairro || '',
      cidade: dados.localidade || '',
      uf: dados.uf || '',
      ibge: dados.ibge || '',
      gia: dados.gia || '',
      ddd: dados.ddd || '',
      siafi: dados.siafi || '',
    };
  } catch (error) {
    console.error('❌ Erro ao consultar CEP:', error);

    if (error.message.includes('CEP')) {
      throw error;
    }

    throw new Error('Erro ao conectar com o serviço de CEP. Verifique sua conexão e tente novamente.');
  }
};

/**
 * Busca CEP por endereço (pesquisa reversa)
 * @param {string} uf - UF (2 letras)
 * @param {string} cidade - Nome da cidade
 * @param {string} logradouro - Nome do logradouro
 * @returns {Promise<Array>} Lista de CEPs encontrados
 */
export const buscarCEPPorEndereco = async (uf, cidade, logradouro) => {
  if (!uf || !cidade || !logradouro) {
    throw new Error('UF, cidade e logradouro são obrigatórios para busca.');
  }

  if (logradouro.length < 3) {
    throw new Error('O logradouro deve ter no mínimo 3 caracteres.');
  }

  try {
    const url = `https://viacep.com.br/ws/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`;

    console.log('🔍 Buscando CEP por endereço:', { uf, cidade, logradouro });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro ao buscar CEP. Tente novamente.');
    }

    const dados = await response.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      throw new Error('Nenhum CEP encontrado para este endereço.');
    }

    console.log(`✅ ${dados.length} CEP(s) encontrado(s)`);

    // Normaliza os dados
    return dados.map(item => ({
      cep: formatarCEP(item.cep),
      logradouro: item.logradouro || '',
      complemento: item.complemento || '',
      bairro: item.bairro || '',
      cidade: item.localidade || '',
      uf: item.uf || '',
      ibge: item.ibge || '',
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar CEP:', error);

    if (error.message.includes('CEP') || error.message.includes('endereço')) {
      throw error;
    }

    throw new Error('Erro ao conectar com o serviço de CEP. Verifique sua conexão e tente novamente.');
  }
};
