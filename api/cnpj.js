// Vercel Serverless Function - Proxy para API Infosimples
// Evita problemas de CORS ao chamar a API do backend

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cnpj } = req.query;

  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ é obrigatório' });
  }

  const token = process.env.VITE_INFOSIMPLES_TOKEN || process.env.INFOSIMPLES_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Token Infosimples não configurado' });
  }

  try {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    const url = `https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj?cnpj=${cnpjLimpo}&token=${token}`;

    console.log('Consultando CNPJ:', cnpjLimpo);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (data.code !== 200) {
      return res.status(400).json({
        error: data.message || data.code_message || 'Erro na consulta do CNPJ',
        code: data.code,
      });
    }

    // Formatar dados para o formato esperado pelo frontend
    const dados = data.data[0];
    const resultado = {
      cnpj: dados.cnpj,
      nome: dados.razao_social,
      fantasia: dados.nome_fantasia || '',
      situacao: dados.situacao_cadastral,
      data_situacao: dados.data_situacao_cadastral,
      natureza_juridica: dados.natureza_juridica,
      data_abertura: dados.data_abertura,
      capital_social: dados.capital_social,
      porte: dados.porte,
      logradouro: dados.logradouro,
      numero: dados.numero,
      complemento: dados.complemento,
      bairro: dados.bairro,
      municipio: dados.municipio,
      uf: dados.uf,
      cep: dados.cep,
      email: dados.email,
      telefone: dados.telefone,
      atividade_principal: dados.atividade_principal ? [{
        code: dados.atividade_principal.codigo,
        text: dados.atividade_principal.descricao,
      }] : [],
      atividades_secundarias: (dados.atividades_secundarias || []).map(a => ({
        code: a.codigo,
        text: a.descricao,
      })),
      qsa: (dados.qsa || []).map((socio) => ({
        nome_socio: socio.nome,
        nome: socio.nome,
        qualificacao_socio: socio.qualificacao,
        qualificacao: socio.qualificacao,
        cpf_cnpj_socio: socio.cpf_cnpj || '',
      })),
    };

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    return res.status(500).json({
      error: 'Erro ao consultar CNPJ',
      message: error.message,
    });
  }
}
