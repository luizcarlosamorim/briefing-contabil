import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Save, CheckCircle, ExternalLink, Loader } from 'lucide-react';
import { useBriefing } from '../../../../contexts/BriefingContext';
import { useAuth } from '../../../../hooks/useAuth';
import { useToast } from '../../../ui/Toast';
import { Button } from '../../../common/Button';
import { tiposEntidade } from '../../../../constants/briefingData';
import { briefingsService } from '../../../../services/supabase';

export const RevisaoFinal = () => {
  const { dados, tipoEntidade, etapaAnterior, salvarProgresso } = useBriefing();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [protocolo, setProtocolo] = useState(null);

  const gerarRelatorio = () => {
    const tipoEntidadeLabel = tiposEntidade.find(t => t.valor === tipoEntidade)?.label || 'Não definido';

    const relatorio = `
═══════════════════════════════════════════════════════════
    BRIEFING CONTÁBIL - ${dados.dadosGerais.finalidade.toUpperCase()}
═══════════════════════════════════════════════════════════

📋 DADOS GERAIS DO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome/Razão Social: ${dados.dadosGerais.nomeCliente}
CPF/CNPJ: ${dados.dadosGerais.cpfCnpj}
E-mail: ${dados.dadosGerais.email}
Telefone: ${dados.dadosGerais.telefone}
Finalidade: ${dados.dadosGerais.finalidade.toUpperCase()}

🏢 TIPO DE ENTIDADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo Escolhido: ${tipoEntidadeLabel}
Nome da Entidade: ${dados.entidadeNome}

📍 ENDEREÇO DA SEDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.endereco.logradouro}, ${dados.endereco.numero}
${dados.endereco.complemento ? `${dados.endereco.complemento}\n` : ''}${dados.endereco.bairro}
${dados.endereco.cidade} - ${dados.endereco.uf}
CEP: ${dados.endereco.cep}
Tipo de Imóvel: ${dados.endereco.tipoImovel.toUpperCase()}

📝 OBJETO SOCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.objetoSocial}

💰 INFORMAÇÕES FINANCEIRAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Faturamento Estimado: ${dados.faturamentoEstimado || 'Não informado'}
Regime Tributário: ${dados.especificos.regimeTributario || 'Não informado'}
Faixa de Faturamento: ${dados.especificos.faixaFaturamento || 'Não informado'}

📋 INSCRIÇÕES NECESSÁRIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Inscrição Estadual: ${dados.inscricoes.estadual ? '✓ SIM' : '✗ NÃO'}
Inscrição Municipal: ${dados.inscricoes.municipal ? '✓ SIM' : '✗ NÃO'}
Inscrições Especiais: ${dados.inscricoes.especial ? '✓ SIM' : '✗ NÃO'}

👥 SÓCIOS / INSTITUIDORES (${dados.socios.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.socios.map((socio, index) => `
${index + 1}. ${socio.nome}
   CPF/CNPJ: ${socio.cpfCnpj}
   Qualificação: ${socio.qualificacao}
   Participação: ${socio.percentual}%
   E-mail: ${socio.email || 'Não informado'}
   Telefone: ${socio.telefone || 'Não informado'}
   Endereço: ${socio.endereco.cidade ? `${socio.endereco.cidade} - ${socio.endereco.uf}` : 'Não informado'}
`).join('\n')}

${(dados.documentos && dados.documentos.length > 0) ? `📎 DOCUMENTOS ANEXADOS (${dados.documentos.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.documentos.map((doc, index) => `${index + 1}. ${doc.nome}
   Tipo: ${doc.tipoDocumento}
   Tamanho: ${(doc.tamanho / 1024).toFixed(2)} KB
   Data Upload: ${new Date(doc.dataUpload).toLocaleString('pt-BR')}`).join('\n\n')}
` : ''}
${dados.especificos.observacoes ? `📌 OBSERVAÇÕES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dados.especificos.observacoes}
` : ''}
═══════════════════════════════════════════════════════════
Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
Sistema: Briefing Contábil v2.0
═══════════════════════════════════════════════════════════
    `.trim();

    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefing-${dados.dadosGerais.nomeCliente.replace(/\s/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const salvarNoBanco = async () => {
    setSalvando(true);
    try {
      console.log('[DEBUG] Iniciando salvamento do briefing no Supabase...');
      console.log('[DEBUG] Dados completos:', dados);
      console.log('[DEBUG] Tipo Entidade:', tipoEntidade);

      // Preparar dados para envio ao Supabase
      const briefingData = {
        // Dados Gerais
        nomeCliente: dados.dadosGerais.nomeCliente,
        cpfCnpj: dados.dadosGerais.cpfCnpj,
        email: dados.dadosGerais.email,
        telefone: dados.dadosGerais.telefone,
        finalidade: dados.dadosGerais.finalidade,

        // Entidade
        tipoEntidade,
        entidadeNome: dados.entidadeNome,
        objetoSocial: dados.objetoSocial,
        faturamentoEstimado: dados.faturamentoEstimado || '',
        capitalSocial: dados.capitalSocial || '',
        totalQuotas: dados.totalQuotas || '',

        // Endereço
        endereco: dados.endereco,

        // Inscrições
        inscricoes: dados.inscricoes || { estadual: false, municipal: false, especial: false },

        // Sócios (remover propriedade 'id' usada apenas no frontend)
        socios: (dados.socios || []).map(({ id, ...socio }) => socio),

        // Documentos (se houver)
        documentos: dados.documentos || [],

        // Dados específicos
        especificos: dados.especificos || {},

        // Status
        status: 'completo',
      };

      console.log('[DEBUG] Dados formatados para envio:', briefingData);

      // Usar Supabase para salvar
      const response = await briefingsService.create(briefingData);
      console.log('[DEBUG] Resposta do Supabase:', response.data);
      const briefingSalvo = response.data;

      setProtocolo(briefingSalvo.protocolo);

      toast.success(
        `Protocolo: ${briefingSalvo.protocolo}\n\nVocê pode acessar seu briefing através do link que será exibido.`,
        'Briefing salvo com sucesso!'
      );

      return briefingSalvo;
    } catch (error) {
      console.error('[DEBUG] Erro ao salvar briefing:', error);
      console.error('[DEBUG] Detalhes do erro:', error.message);

      const mensagemErro = error.message || 'Erro desconhecido';
      toast.error(
        `${mensagemErro}\n\nVerifique o console para mais informações.`,
        'Erro ao salvar briefing'
      );
      return null;
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvar = () => {
    const sucesso = salvarProgresso();
    if (sucesso) {
      toast.success('Seu progresso foi salvo e pode ser recuperado mais tarde.', 'Progresso salvo!');
    } else {
      toast.error('Não foi possível salvar o progresso. Tente novamente.', 'Erro ao salvar');
    }
  };

  const tipoEntidadeLabel = tiposEntidade.find(t => t.valor === tipoEntidade)?.label || 'Não definido';

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle size={48} className="mx-auto mb-3 text-green-600" />
        <h3 className="text-xl font-bold text-green-900 mb-2">
          Briefing Completo!
        </h3>
        <p className="text-green-700">
          Revise todas as informações antes de gerar o relatório final
        </p>
      </div>

      {/* Dados Gerais */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          📋 Dados Gerais
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Nome:</span>
            <p className="text-gray-900">{dados.dadosGerais.nomeCliente}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">CPF/CNPJ:</span>
            <p className="text-gray-900">{dados.dadosGerais.cpfCnpj}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">E-mail:</span>
            <p className="text-gray-900">{dados.dadosGerais.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Telefone:</span>
            <p className="text-gray-900">{dados.dadosGerais.telefone}</p>
          </div>
        </div>
      </div>

      {/* Entidade */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          🏢 Entidade
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">Tipo:</span>
            <p className="text-gray-900">{tipoEntidadeLabel}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Nome/Razão Social:</span>
            <p className="text-gray-900">{dados.entidadeNome}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Objeto Social:</span>
            <p className="text-gray-900">{dados.objetoSocial}</p>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          📍 Endereço
        </h3>
        <p className="text-sm text-gray-900">
          {dados.endereco.logradouro}, {dados.endereco.numero}
          {dados.endereco.complemento && ` - ${dados.endereco.complemento}`}
          <br />
          {dados.endereco.bairro}
          <br />
          {dados.endereco.cidade} - {dados.endereco.uf}
          <br />
          CEP: {dados.endereco.cep}
        </p>
      </div>

      {/* Sócios */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          👥 Sócios ({dados.socios.length})
        </h3>
        {dados.socios.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum sócio cadastrado</p>
        ) : (
          <div className="space-y-3">
            {dados.socios.map((socio, index) => (
              <div key={socio.id} className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-medium text-gray-900">
                  {index + 1}. {socio.nome}
                </p>
                <p className="text-gray-700 text-xs">
                  {socio.qualificacao} - {socio.percentual}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documentos */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          📎 Documentos Anexados ({(dados.documentos || []).length})
        </h3>
        {(dados.documentos || []).length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum documento enviado</p>
        ) : (
          <div className="space-y-2">
            {dados.documentos.map((doc, index) => (
              <div key={doc.id} className="bg-gray-50 p-3 rounded text-sm flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-gray-600">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.nome}</p>
                    <p className="text-xs text-gray-500">
                      {(doc.tamanho / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex-shrink-0">
                  {doc.tipoDocumento}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Protocolo Gerado */}
      {protocolo && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
          <CheckCircle size={48} className="mx-auto mb-3 text-green-600" />
          <h3 className="text-xl font-bold text-green-900 mb-2">
            Briefing Salvo com Sucesso!
          </h3>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Número do Protocolo:</p>
            <p className="text-3xl font-bold text-blue-600 mb-4">{protocolo}</p>
            <button
              onClick={() => navigate(`/protocolo/${protocolo}`)}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={18} />
              Visualizar Protocolo
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Guarde este número para consultar seu briefing a qualquer momento.
          </p>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button
          type="button"
          variant="secondary"
          icon={ArrowLeft}
          onClick={etapaAnterior}
          disabled={salvando}
        >
          Voltar
        </Button>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            icon={Save}
            onClick={handleSalvar}
            disabled={salvando}
          >
            Salvar Localmente
          </Button>

          <Button
            type="button"
            variant="outline"
            icon={Download}
            onClick={gerarRelatorio}
            disabled={salvando}
          >
            Baixar TXT
          </Button>

          {!protocolo && (
            <Button
              type="button"
              variant="success"
              icon={salvando ? Loader : CheckCircle}
              onClick={salvarNoBanco}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Finalizar e Gerar Protocolo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
