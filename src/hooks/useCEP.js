import { useState } from 'react';
import { consultarCEP, validarCEP } from '../services/cepService';

export const useCEP = () => {
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [cepEncontrado, setCepEncontrado] = useState(null);
  const [erro, setErro] = useState(null);

  const buscarDadosCEP = async (cep, onSuccess) => {
    if (!validarCEP(cep)) {
      setErro('CEP inválido. Digite um CEP válido com 8 dígitos.');
      return null;
    }

    setBuscandoCEP(true);
    setCepEncontrado(null);
    setErro(null);

    try {
      const dadosCEP = await consultarCEP(cep);

      console.log('✅ CEP encontrado:', dadosCEP.logradouro);
      setCepEncontrado(dadosCEP);

      // Callback com os dados encontrados
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(dadosCEP);
      }

      return dadosCEP;
    } catch (error) {
      console.error('❌ Erro ao buscar CEP:', error);
      const mensagemErro = error.message || 'Erro ao conectar com o serviço de CEP. Tente novamente.';
      setErro(mensagemErro);
      return null;
    } finally {
      setBuscandoCEP(false);
    }
  };

  const limparErro = () => {
    setErro(null);
  };

  const limparCEP = () => {
    setCepEncontrado(null);
    setErro(null);
  };

  return {
    buscandoCEP,
    cepEncontrado,
    erro,
    buscarDadosCEP,
    limparErro,
    limparCEP,
  };
};
