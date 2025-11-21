// ============================================
// Serviço de Consulta CNPJ - Via API Proxy
// ============================================

/**
 * Consulta CNPJ através do proxy serverless (evita CORS)
 * @param {string} cnpj - CNPJ a ser consultado (com ou sem formatação)
 * @returns {Promise<Object>} Dados do CNPJ
 */
export const consultarCNPJ = async (cnpj) => {
  try {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');

    console.log('🔍 Consultando CNPJ via API proxy...');

    // Chamar a API proxy (serverless function da Vercel)
    // Em produção: /api/cnpj
    // Em desenvolvimento: pode usar localhost:3001 se tiver backend
    const apiUrl = `/api/cnpj?cnpj=${cnpjLimpo}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ CNPJ encontrado:', data.nome);

    return data;
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    throw error;
  }
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
