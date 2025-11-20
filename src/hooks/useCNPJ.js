import { useState } from 'react';
import { consultarCNPJ, validarCNPJ } from '../services/cnpjService';
import { useBriefing } from '../contexts/BriefingContext';

export const useCNPJ = () => {
  const [buscandoCNPJ, setBuscandoCNPJ] = useState(false);
  const [cnpjEncontrado, setCnpjEncontrado] = useState(null);
  const [erro, setErro] = useState(null);
  const { setDados } = useBriefing();

  const buscarDadosCNPJ = async (cnpj) => {
    if (!validarCNPJ(cnpj)) {
      setErro('CNPJ inválido. Digite um CNPJ válido com 14 dígitos.');
      return null;
    }

    setBuscandoCNPJ(true);
    setCnpjEncontrado(null);
    setErro(null);

    try {
      console.log('🔍 Consultando CNPJ via backend...');
      const dadosCNPJ = await consultarCNPJ(cnpj);

      console.log('✅ CNPJ encontrado:', dadosCNPJ.nome);
      setCnpjEncontrado(dadosCNPJ);

      // Criar resumo para confirmação
      const resumo = criarResumo(dadosCNPJ);
      const confirmacao = window.confirm(resumo);

      if (confirmacao) {
        preencherDadosCNPJ(dadosCNPJ);
      }

      return dadosCNPJ;
    } catch (error) {
      console.error('❌ Erro ao buscar CNPJ:', error);
      const mensagemErro = error.message || 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
      setErro(mensagemErro);
      return null;
    } finally {
      setBuscandoCNPJ(false);
    }
  };

  const criarResumo = (dadosCNPJ) => {
    const resumo = `
✅ CNPJ encontrado na Receita Federal!

📋 DADOS DA EMPRESA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Razão Social: ${dadosCNPJ.nome}
${dadosCNPJ.fantasia ? `Nome Fantasia: ${dadosCNPJ.fantasia}\n` : ''}CNPJ: ${dadosCNPJ.cnpj}
Situação: ${dadosCNPJ.situacao}
${dadosCNPJ.data_situacao ? `Data Situação: ${dadosCNPJ.data_situacao}\n` : ''}
📍 ENDEREÇO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dadosCNPJ.logradouro}, ${dadosCNPJ.numero}
${dadosCNPJ.complemento ? `${dadosCNPJ.complemento}\n` : ''}${dadosCNPJ.bairro}
${dadosCNPJ.municipio}/${dadosCNPJ.uf}
CEP: ${dadosCNPJ.cep}

💼 ATIVIDADE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dadosCNPJ.atividade_principal?.[0]?.text || 'Não informado'}

${dadosCNPJ.capital_social ? `💰 Capital Social: R$ ${parseFloat(dadosCNPJ.capital_social).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` : ''}${dadosCNPJ.porte ? `📊 Porte: ${dadosCNPJ.porte}\n` : ''}${dadosCNPJ.natureza_juridica ? `🏛️ Natureza Jurídica: ${dadosCNPJ.natureza_juridica}\n` : ''}${dadosCNPJ.qsa?.length > 0 ? `\n👥 Sócios: ${dadosCNPJ.qsa.length} encontrado(s)\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deseja preencher automaticamente o formulário com estes dados?
    `.trim();

    return resumo;
  };

  const preencherDadosCNPJ = (dadosCNPJ) => {
    setDados(prev => ({
      ...prev,
      entidadeNome: dadosCNPJ.nome || dadosCNPJ.fantasia,
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
      objetoSocial: dadosCNPJ.atividade_principal?.[0]?.text || prev.objetoSocial,
      dadosGerais: {
        ...prev.dadosGerais,
        nomeCliente: dadosCNPJ.nome || dadosCNPJ.fantasia || prev.dadosGerais.nomeCliente,
        email: dadosCNPJ.email || prev.dadosGerais.email,
        telefone: dadosCNPJ.telefone || prev.dadosGerais.telefone
      },
      // Salvar dados completos da Infosimples
      dadosInfosimples: dadosCNPJ
    }));

    // Se houver QSA, sugerir importação de sócios
    if (dadosCNPJ.qsa && dadosCNPJ.qsa.length > 0) {
      const importarSocios = window.confirm(
        `Foram encontrados ${dadosCNPJ.qsa.length} sócio(s) no Quadro de Sócios e Administradores.\n\nDeseja importá-los automaticamente?`
      );

      if (importarSocios) {
        const sociosImportados = dadosCNPJ.qsa.map((socio, index) => ({
          id: Date.now() + index,
          nome: socio.nome_socio || socio.nome,
          cpfCnpj: socio.cpf_cnpj_socio || '',
          percentual: '',
          qualificacao: socio.qualificacao_socio || socio.qualificacao || '',
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
        }));

        setDados(prev => ({
          ...prev,
          socios: sociosImportados
        }));
      }
    }
  };

  const limparErro = () => {
    setErro(null);
  };

  return {
    buscandoCNPJ,
    cnpjEncontrado,
    erro,
    buscarDadosCNPJ,
    limparErro
  };
};
