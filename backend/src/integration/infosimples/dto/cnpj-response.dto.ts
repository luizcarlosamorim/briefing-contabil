export class CNPJResponseDto {
  nome: string;
  fantasia?: string;
  cnpj: string;
  situacao: string;
  data_situacao?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  email?: string;
  telefone?: string;
  atividade_principal?: Array<{ code: string; text: string }>;
  atividades_secundarias?: Array<{ code: string; text: string }>;
  natureza_juridica?: string;
  capital_social?: string;
  porte?: string;
  qsa?: Array<{
    nome_socio: string;
    qualificacao_socio: string;
    cpf_cnpj_socio?: string;
  }>;
  data_abertura?: string;
  situacao_especial?: string;
  opcao_simples?: string;
  opcao_mei?: string;
  comprovantes?: string[];
}
