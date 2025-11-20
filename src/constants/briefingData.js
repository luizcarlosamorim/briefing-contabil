export const tiposEntidade = [
  { valor: 'associacao', label: 'Associação Privada', icon: '🤝' },
  { valor: 'oscip', label: 'OSCIP / ONG', icon: '❤️' },
  { valor: 'spe', label: 'SPE - Sociedade de Propósito Específico', icon: '🎯' },
  { valor: 'sa', label: 'S.A. - Sociedade Anônima', icon: '📈' },
  { valor: 'holding', label: 'Holding', icon: '🏢' },
  { valor: 'limitada', label: 'Sociedade Limitada (LTDA)', icon: '🏪' },
  { valor: 'simples', label: 'Sociedade Simples', icon: '👔' }
];

export const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const etapas = [
  { id: 0, titulo: 'Dados Gerais', icon: 'FileText' },
  { id: 1, titulo: 'Tipo de Entidade', icon: 'Building2' },
  { id: 2, titulo: 'Dados da Entidade', icon: 'Building2' },
  { id: 3, titulo: 'Sócios/Instituidores', icon: 'Users' },
  { id: 4, titulo: 'Informações Específicas', icon: 'CheckCircle' },
  { id: 5, titulo: 'Revisão Final', icon: 'Download' }
];

export const finalidadesBriefing = [
  { value: 'abertura', label: 'Abertura de Empresa' },
  { value: 'alteracao', label: 'Alteração Contratual' },
  { value: 'encerramento', label: 'Encerramento de Atividades' },
  { value: 'regularizacao', label: 'Regularização' }
];

export const tiposImovel = [
  { value: 'proprio', label: 'Próprio' },
  { value: 'alugado', label: 'Alugado' },
  { value: 'comodato', label: 'Comodato' },
  { value: 'virtual', label: 'Sede Virtual' }
];

export const qualificacoesSocio = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'socio', label: 'Sócio' },
  { value: 'socio_administrador', label: 'Sócio Administrador' },
  { value: 'presidente', label: 'Presidente' },
  { value: 'diretor', label: 'Diretor' },
  { value: 'conselheiro', label: 'Conselheiro' },
  { value: 'quotista', label: 'Quotista' },
  { value: 'acionista', label: 'Acionista' }
];

export const regimesTributarios = [
  { value: 'simples', label: 'Simples Nacional' },
  { value: 'presumido', label: 'Lucro Presumido' },
  { value: 'real', label: 'Lucro Real' },
  { value: 'mei', label: 'MEI - Microempreendedor Individual' }
];

export const faixasFaturamento = [
  { value: 'ate_81k', label: 'Até R$ 81.000 (MEI)' },
  { value: '81k_360k', label: 'R$ 81.000 a R$ 360.000 (ME)' },
  { value: '360k_4_8mi', label: 'R$ 360.000 a R$ 4.800.000 (EPP)' },
  { value: 'acima_4_8mi', label: 'Acima de R$ 4.800.000' }
];
