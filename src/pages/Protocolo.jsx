import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, User, Mail, Phone, Building, MapPin, Users, Calendar, CheckCircle, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import api from '../services/api';

export default function Protocolo() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarBriefing = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/briefings/protocolo/${numero}`);
        setBriefing(response.data);
      } catch (err) {
        console.error('Erro ao buscar protocolo:', err);
        setError(err.response?.data?.message || 'Protocolo não encontrado');
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Protocolo não encontrado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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
