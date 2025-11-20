import React, { useState } from 'react';
import { ArrowLeft, Upload, File, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useBriefing } from '../../../../contexts/BriefingContext';
import { Button } from '../../../common/Button';

export const Documentos = () => {
  const { dados, setDados, proximaEtapa, etapaAnterior } = useBriefing();
  const [uploadando, setUploadando] = useState(false);
  const [erro, setErro] = useState(null);

  const documentosSugeridos = [
    { id: 'rg_cpf', nome: 'RG e CPF dos sócios', obrigatorio: true },
    { id: 'comprovante_residencia', nome: 'Comprovante de residência dos sócios', obrigatorio: true },
    { id: 'contrato_social', nome: 'Contrato Social (se alteração)', obrigatorio: false },
    { id: 'iptu', nome: 'IPTU do imóvel', obrigatorio: false },
    { id: 'contrato_locacao', nome: 'Contrato de locação (se alugado)', obrigatorio: false },
    { id: 'certidao_casamento', nome: 'Certidão de casamento (se aplicável)', obrigatorio: false },
    { id: 'outros', nome: 'Outros documentos', obrigatorio: false },
  ];

  const handleFileChange = async (e, tipoDocumento) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setUploadando(true);
    setErro(null);

    try {
      // Validar tamanho dos arquivos (max 10MB cada)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const arquivosGrandes = files.filter(file => file.size > maxSize);

      if (arquivosGrandes.length > 0) {
        setErro(`Alguns arquivos excedem o tamanho máximo de 10MB: ${arquivosGrandes.map(f => f.name).join(', ')}`);
        setUploadando(false);
        return;
      }

      // Validar tipos de arquivo permitidos
      const tiposPermitidos = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      const arquivosInvalidos = files.filter(file => !tiposPermitidos.includes(file.type));

      if (arquivosInvalidos.length > 0) {
        setErro(`Tipos de arquivo não permitidos: ${arquivosInvalidos.map(f => f.name).join(', ')}`);
        setUploadando(false);
        return;
      }

      // Converter arquivos para base64 para armazenamento temporário
      const arquivosProcessados = await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                id: Date.now() + Math.random(),
                nome: file.name,
                tipo: file.type,
                tamanho: file.size,
                tipoDocumento,
                dataUpload: new Date().toISOString(),
                // Para desenvolvimento, armazenamos o base64
                // Em produção, deve-se fazer upload para servidor/cloud
                dados: event.target.result,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      setDados(prev => ({
        ...prev,
        documentos: [...(prev.documentos || []), ...arquivosProcessados]
      }));

    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
      setErro('Erro ao processar arquivos. Tente novamente.');
    } finally {
      setUploadando(false);
    }
  };

  const removerDocumento = (id) => {
    if (window.confirm('Deseja realmente remover este documento?')) {
      setDados(prev => ({
        ...prev,
        documentos: prev.documentos.filter(doc => doc.id !== id)
      }));
    }
  };

  const formatarTamanho = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDocumentosPorTipo = (tipo) => {
    return (dados.documentos || []).filter(doc => doc.tipoDocumento === tipo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar se documentos obrigatórios foram enviados
    const documentosObrigatorios = documentosSugeridos.filter(d => d.obrigatorio);
    const faltantes = documentosObrigatorios.filter(
      doc => getDocumentosPorTipo(doc.id).length === 0
    );

    if (faltantes.length > 0) {
      const continuar = window.confirm(
        `Os seguintes documentos obrigatórios não foram enviados:\n\n` +
        `${faltantes.map(d => `- ${d.nome}`).join('\n')}\n\n` +
        `Deseja continuar mesmo assim?`
      );

      if (!continuar) return;
    }

    proximaEtapa();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Envio de Documentos
            </h3>
            <p className="text-sm text-blue-700">
              Envie os documentos necessários para o processo. Arquivos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB cada).
            </p>
          </div>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <p className="text-sm text-red-700">{erro}</p>
          </div>
        </div>
      )}

      {/* Lista de tipos de documentos */}
      <div className="space-y-6">
        {documentosSugeridos.map((tipoDoc) => {
          const documentosDoTipo = getDocumentosPorTipo(tipoDoc.id);

          return (
            <div key={tipoDoc.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">
                    {tipoDoc.nome}
                  </h4>
                  {tipoDoc.obrigatorio && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Obrigatório
                    </span>
                  )}
                  {documentosDoTipo.length > 0 && (
                    <CheckCircle size={18} className="text-green-600" />
                  )}
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e, tipoDoc.id)}
                    className="hidden"
                    disabled={uploadando}
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Upload size={18} />
                    <span className="text-sm font-medium">
                      {uploadando ? 'Enviando...' : 'Selecionar Arquivos'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Arquivos enviados */}
              {documentosDoTipo.length > 0 && (
                <div className="space-y-2 mt-4">
                  {documentosDoTipo.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <File size={20} className="text-gray-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.nome}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatarTamanho(doc.tamanho)} • {new Date(doc.dataUpload).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerDocumento(doc.id)}
                        className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <h4 className="font-medium text-gray-900 mb-3">Resumo do Envio</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total de Arquivos</p>
            <p className="text-2xl font-bold text-gray-900">{(dados.documentos || []).length}</p>
          </div>
          <div>
            <p className="text-gray-600">Tamanho Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatarTamanho((dados.documentos || []).reduce((acc, doc) => acc + doc.tamanho, 0))}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Obrigatórios</p>
            <p className="text-2xl font-bold text-green-600">
              {documentosSugeridos.filter(d => d.obrigatorio && getDocumentosPorTipo(d.id).length > 0).length}/
              {documentosSugeridos.filter(d => d.obrigatorio).length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Opcionais</p>
            <p className="text-2xl font-bold text-blue-600">
              {documentosSugeridos.filter(d => !d.obrigatorio && getDocumentosPorTipo(d.id).length > 0).length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="secondary"
          icon={ArrowLeft}
          onClick={etapaAnterior}
          disabled={uploadando}
        >
          Voltar
        </Button>

        <Button type="submit" variant="primary" disabled={uploadando}>
          Continuar para Revisão
        </Button>
      </div>
    </form>
  );
};
