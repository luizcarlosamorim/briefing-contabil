import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useBriefing } from '../../../../contexts/BriefingContext';
import { useToast } from '../../../ui/Toast';
import { Button } from '../../../common/Button';
import { tiposEntidade } from '../../../../constants/briefingData';

export const TipoEntidade = () => {
  const { dados, setDados, tipoEntidade, setTipoEntidade, proximaEtapa, etapaAnterior } = useBriefing();
  const toast = useToast();

  const handleSelectTipo = (tipo) => {
    setTipoEntidade(tipo);
    setDados(prev => ({
      ...prev,
      tipoEntidade: tipo
    }));
  };

  const handleContinuar = () => {
    if (!tipoEntidade) {
      toast.warning('Por favor, selecione um tipo de entidade antes de continuar.', 'Seleção necessária');
      return;
    }
    proximaEtapa();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Selecione o Tipo de Entidade
        </h3>
        <p className="text-gray-600 mb-6">
          Escolha o tipo de entidade que melhor se adequa ao seu negócio
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiposEntidade.map((tipo) => (
            <button
              key={tipo.valor}
              type="button"
              onClick={() => handleSelectTipo(tipo.valor)}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200
                hover:shadow-md hover:scale-105
                ${
                  tipoEntidade === tipo.valor
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="text-4xl mb-3">{tipo.icon}</div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {tipo.label}
              </h4>
              {tipoEntidade === tipo.valor && (
                <div className="mt-2 text-blue-600 text-xs font-medium">
                  ✓ Selecionado
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="secondary"
          icon={ArrowLeft}
          onClick={etapaAnterior}
        >
          Voltar
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleContinuar}
          disabled={!tipoEntidade}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
