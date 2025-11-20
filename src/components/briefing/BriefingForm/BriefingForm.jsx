import React, { useEffect } from 'react';
import { FileText, Building2, Users, CheckCircle, Download, Upload } from 'lucide-react';
import { useBriefing } from '../../../contexts/BriefingContext';
import { DadosGerais } from './steps/DadosGerais';
import { TipoEntidade } from './steps/TipoEntidade';
import { DadosEntidade } from './steps/DadosEntidade';
import { Socios } from './steps/Socios';
import { Documentos } from './steps/Documentos';
import { InformacoesEspecificas } from './steps/InformacoesEspecificas';
import { RevisaoFinal } from './steps/RevisaoFinal';

const ETAPAS_CONFIG = [
  { id: 0, titulo: 'Dados Gerais', icon: FileText, component: DadosGerais },
  { id: 1, titulo: 'Tipo de Entidade', icon: Building2, component: TipoEntidade },
  { id: 2, titulo: 'Dados da Entidade', icon: Building2, component: DadosEntidade },
  { id: 3, titulo: 'Sócios/Instituidores', icon: Users, component: Socios },
  { id: 4, titulo: 'Documentos', icon: Upload, component: Documentos },
  { id: 5, titulo: 'Informações Específicas', icon: CheckCircle, component: InformacoesEspecificas },
  { id: 6, titulo: 'Revisão Final', icon: Download, component: RevisaoFinal }
];

export const BriefingForm = () => {
  const { etapaAtual, irParaEtapa, carregarProgresso } = useBriefing();

  // Carregar progresso salvo ao montar o componente
  useEffect(() => {
    const progressoCarregado = carregarProgresso();
    if (progressoCarregado) {
      const confirmar = window.confirm(
        'Encontramos um briefing salvo anteriormente.\n\nDeseja continuar de onde parou?'
      );
      if (!confirmar) {
        // Se não quiser continuar, limpa o localStorage
        localStorage.removeItem('briefing_progresso');
      }
    }
  }, []);

  const EtapaAtualComponent = ETAPAS_CONFIG[etapaAtual]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Briefing Contábil
          </h1>
          <p className="text-gray-600">
            Preencha as informações para abertura ou regularização de sua entidade
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            {ETAPAS_CONFIG.map((etapa, index) => {
              const Icon = etapa.icon;
              const isCompleted = etapaAtual > index;
              const isCurrent = etapaAtual === index;
              const isClickable = isCompleted || isCurrent;

              return (
                <React.Fragment key={etapa.id}>
                  <button
                    type="button"
                    onClick={() => isClickable && irParaEtapa(index)}
                    disabled={!isClickable}
                    className={`
                      flex flex-col items-center gap-2 transition-all
                      ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                      ${isCurrent ? 'scale-110' : ''}
                    `}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        transition-all duration-200
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${isCurrent ? 'bg-blue-600 text-white shadow-lg' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle size={24} />
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>
                    <span
                      className={`
                        text-xs font-medium text-center hidden sm:block
                        ${isCurrent ? 'text-blue-600' : 'text-gray-600'}
                      `}
                    >
                      {etapa.titulo}
                    </span>
                  </button>

                  {index < ETAPAS_CONFIG.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2 rounded
                        transition-all duration-300
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile step indicator */}
          <div className="sm:hidden text-center mt-4">
            <span className="text-sm font-medium text-gray-700">
              Etapa {etapaAtual + 1} de {ETAPAS_CONFIG.length}:{' '}
              <span className="text-blue-600">
                {ETAPAS_CONFIG[etapaAtual]?.titulo}
              </span>
            </span>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="transition-all duration-300">
          {EtapaAtualComponent ? (
            <EtapaAtualComponent />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <p className="text-red-600">Etapa não encontrada</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Sistema de Briefing Contábil v2.0</p>
          <p className="mt-1">
            Seus dados são salvos automaticamente no navegador
          </p>
        </div>
      </div>
    </div>
  );
};
