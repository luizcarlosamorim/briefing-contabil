const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Consulta CNPJ através do backend (que se comunica com Infosimples)
 * @param {string} cnpj - CNPJ a ser consultado (com ou sem formatação)
 * @returns {Promise<Object>} Dados do CNPJ
 */
export const consultarCNPJ = async (cnpj) => {
  try {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');

    const response = await fetch(`${API_URL}/cnpj?cnpj=${cnpjLimpo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
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
