import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, User, Mail, Phone, Building, MapPin, Users, Calendar, CheckCircle, AlertCircle, ArrowLeft, Download, Copy, Check } from 'lucide-react';
import { briefingsService } from '../services/supabase';

export default function Protocolo() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const copiarURL = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  useEffect(() => {
    const buscarBriefing = async () => {
      // Timeout de 10 segundos para não ficar carregando eternamente
      const timeoutId = setTimeout(() => {
        setError('Tempo limite excedido. Verifique se as políticas RLS do Supabase permitem leitura pública da tabela briefings.');
        setLoading(false);
      }, 10000);

      try {
        setLoading(true);
        console.log('[Protocolo] Buscando briefing:', numero);
        const response = await briefingsService.getByProtocolo(numero);
        clearTimeout(timeoutId);

        if (!response.data) {
          throw new Error('Briefing não encontrado');
        }

        // Converter snake_case para camelCase
        const b = response.data;
        const briefingFormatado = {
          id: b.id,
          protocolo: b.protocolo,
          nomeCliente: b.nome_cliente,
          cpfCnpj: b.cpf_cnpj,
          email: b.email,
          telefone: b.telefone,
          finalidade: b.finalidade,
          tipoEntidade: b.tipo_entidade,
          entidadeNome: b.entidade_nome,
          objetoSocial: b.objeto_social,
          faturamentoEstimado: b.faturamento_estimado,
          capitalSocial: b.capital_social,
          totalQuotas: b.total_quotas,
          endereco: b.endereco || {},
          inscricoes: b.inscricoes || {},
          socios: b.socios || [],
          documentos: b.documentos || [],
          especificos: b.especificos || {},
          status: b.status,
          createdAt: b.created_at
        };
        setBriefing(briefingFormatado);
        console.log('[Protocolo] Briefing carregado com sucesso');
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('[Protocolo] Erro ao buscar:', err);

        // Mensagem de erro mais informativa
        let mensagemErro = 'Protocolo não encontrado';
        if (err.message?.includes('permission denied') || err.message?.includes('RLS')) {
          mensagemErro = 'Acesso negado. Configure as políticas RLS no Supabase para permitir leitura pública.';
        } else if (err.message) {
          mensagemErro = err.message;
        }
        setError(mensagemErro);
      } finally {
        setLoading(false);
      }
    };

    if (numero) {
      buscarBriefing();
    }
  }, [numero]);

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const gerarPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando protocolo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isRLSError = error.includes('RLS') || error.includes('Tempo limite') || error.includes('configurado');

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRLSError ? 'Erro de Configuração' : 'Protocolo não encontrado'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>

          {isRLSError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left text-sm">
              <p className="font-semibold text-yellow-800 mb-2">Possíveis causas:</p>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Variáveis de ambiente não configuradas na Vercel</li>
                <li>Política RLS não permite leitura pública</li>
                <li>Tabela briefings não existe no Supabase</li>
              </ul>
              <p className="mt-3 text-yellow-800">
                <strong>Dica:</strong> Abra o Console do navegador (F12) para ver logs detalhados.
              </p>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 print:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Briefing Contábil</h1>
                <p className="text-sm text-gray-600">Protocolo: {briefing.protocolo}</p>
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={18} />
                Voltar
              </button>
              <button
                onClick={copiarURL}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  copiado
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copiado ? <Check size={18} /> : <Copy size={18} />}
                {copiado ? 'Copiado!' : 'Copiar URL'}
              </button>
              <button
                onClick={gerarPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={18} />
                Imprimir/PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                briefing.status === 'completo' ? 'bg-green-100 text-green-800' :
                briefing.status === 'em_analise' ? 'bg-yellow-100 text-yellow-800' :
                briefing.status === 'aprovado' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {briefing.status.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Data de Criação:</span>
              <p className="text-gray-900">{formatarData(briefing.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Dados do Solicitante */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Dados do Solicitante
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Nome:</span>
              <p className="text-gray-900">{briefing.nomeCliente}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">CPF/CNPJ:</span>
              <p className="text-gray-900">{briefing.cpfCnpj}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">E-mail:</span>
              <p className="text-gray-900">{briefing.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Telefone:</span>
              <p className="text-gray-900">{briefing.telefone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Finalidade:</span>
              <p className="text-gray-900">{briefing.finalidade}</p>
            </div>
          </div>
        </div>

        {/* Dados da Entidade */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="text-blue-600" size={20} />
            Dados da Entidade
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Tipo de Entidade:</span>
              <p className="text-gray-900">{briefing.tipoEntidade}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Nome/Razão Social:</span>
              <p className="text-gray-900">{briefing.entidadeNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Objeto Social:</span>
              <p className="text-gray-900">{briefing.objetoSocial}</p>
            </div>
            {briefing.faturamentoEstimado && (
              <div>
                <span className="font-medium text-gray-700">Faturamento Estimado:</span>
                <p className="text-gray-900">{briefing.faturamentoEstimado}</p>
              </div>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            Endereço
          </h2>
          <p className="text-sm text-gray-900">
            {briefing.endereco.logradouro}, {briefing.endereco.numero}
            {briefing.endereco.complemento && ` - ${briefing.endereco.complemento}`}
            <br />
            {briefing.endereco.bairro}
            <br />
            {briefing.endereco.cidade} - {briefing.endereco.uf}
            <br />
            CEP: {briefing.endereco.cep}
            <br />
            Tipo de Imóvel: {briefing.endereco.tipoImovel}
          </p>
        </div>

        {/* Sócios */}
        {briefing.socios && briefing.socios.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="text-blue-600" size={20} />
              Sócios ({briefing.socios.length})
            </h2>
            <div className="space-y-3">
              {briefing.socios.map((socio, index) => (
                <div key={socio.id} className="bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium text-gray-900 mb-1">
                    {index + 1}. {socio.nome}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div>CPF/CNPJ: {socio.cpfCnpj}</div>
                    <div>Qualificação: {socio.qualificacao}</div>
                    <div>Participação: {socio.percentual}%</div>
                    {socio.email && <div>E-mail: {socio.email}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dados Infosimples (se houver) */}
        {briefing.dadosInfosimples && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-blue-600" size={20} />
              Dados da Receita Federal
            </h2>
            <p className="text-sm text-blue-800">
              Este briefing foi preenchido com dados consultados na Receita Federal via API Infosimples.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600 print:bg-white">
          <p>Sistema de Briefing Contábil v2.0</p>
          <p>Documento gerado em: {formatarData(new Date())}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
        }
      `}</style>
    </div>
  );
}
