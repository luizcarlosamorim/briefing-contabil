import React from 'react';
import { ArrowLeft, Plus, Trash2, User } from 'lucide-react';
import { useBriefing } from '../../../../contexts/BriefingContext';
import { useModal } from '../../../ui/Modal';
import { Input, Select } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { estadosBrasileiros, qualificacoesSocio } from '../../../../constants/briefingData';

export const Socios = () => {
  const { dados, adicionarSocio, atualizarSocio, removerSocio, proximaEtapa, etapaAnterior } = useBriefing();
  const modal = useModal();

  const handleSocioChange = (socioId, campo, valor) => {
    atualizarSocio(socioId, campo, valor);
  };

  const handleSocioEnderecoChange = (socioId, campo, valor) => {
    const socio = dados.socios.find(s => s.id === socioId);
    atualizarSocio(socioId, 'endereco', {
      ...socio.endereco,
      [campo]: valor
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dados.socios.length === 0) {
      const continuar = await modal.warning(
        'Nenhum sócio adicionado',
        'Você não adicionou nenhum sócio/instituidor.\n\nDeseja continuar mesmo assim?',
        { confirmText: 'Continuar', cancelText: 'Voltar' }
      );
      if (!continuar) return;
    }

    proximaEtapa();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User size={20} />
              Sócios / Instituidores
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Adicione os sócios, administradores ou instituidores da entidade
            </p>
          </div>

          <Button
            type="button"
            onClick={adicionarSocio}
            variant="primary"
            icon={Plus}
          >
            Adicionar Sócio
          </Button>
        </div>

        {dados.socios.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User size={48} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum sócio adicionado ainda</p>
            <p className="text-sm mt-1">Clique em "Adicionar Sócio" para começar</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dados.socios.map((socio, index) => (
              <div
                key={socio.id}
                className="border-2 border-gray-200 rounded-lg p-6 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">
                    Sócio #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    onClick={async () => {
                      const confirmar = await modal.danger(
                        'Remover sócio',
                        `Deseja realmente remover "${socio.nome || 'este sócio'}"? Esta ação não pode ser desfeita.`,
                        { confirmText: 'Remover', cancelText: 'Cancelar' }
                      );
                      if (confirmar) removerSocio(socio.id);
                    }}
                    variant="danger"
                    icon={Trash2}
                  >
                    Remover
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome Completo"
                    name={`socio-${socio.id}-nome`}
                    value={socio.nome}
                    onChange={(e) => handleSocioChange(socio.id, 'nome', e.target.value)}
                    placeholder="Nome do sócio"
                    required
                    className="md:col-span-2"
                  />

                  <Input
                    label="CPF/CNPJ"
                    name={`socio-${socio.id}-cpfCnpj`}
                    value={socio.cpfCnpj}
                    onChange={(e) => handleSocioChange(socio.id, 'cpfCnpj', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />

                  <Input
                    label="Quantidade de Quotas"
                    name={`socio-${socio.id}-quotas`}
                    type="number"
                    value={socio.quotas || ''}
                    onChange={(e) => handleSocioChange(socio.id, 'quotas', e.target.value)}
                    placeholder="0"
                    min="0"
                    helpText="Número de quotas que este sócio possui"
                  />

                  <Input
                    label="Percentual de Participação (%)"
                    name={`socio-${socio.id}-percentual`}
                    type="number"
                    value={socio.percentual}
                    onChange={(e) => handleSocioChange(socio.id, 'percentual', e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                  />

                  <Select
                    label="Qualificação"
                    name={`socio-${socio.id}-qualificacao`}
                    value={socio.qualificacao}
                    onChange={(e) => handleSocioChange(socio.id, 'qualificacao', e.target.value)}
                    options={qualificacoesSocio}
                    required
                    className="md:col-span-2"
                  />

                  {/* Checkbox Administrador */}
                  <div className="md:col-span-2 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <input
                      type="checkbox"
                      id={`socio-${socio.id}-administrador`}
                      name={`socio-${socio.id}-administrador`}
                      checked={socio.ehAdministrador || false}
                      onChange={(e) => handleSocioChange(socio.id, 'ehAdministrador', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`socio-${socio.id}-administrador`}
                      className="text-sm font-medium text-blue-900 cursor-pointer"
                    >
                      Este sócio é Administrador da empresa
                    </label>
                  </div>

                  <Input
                    label="E-mail"
                    name={`socio-${socio.id}-email`}
                    type="email"
                    value={socio.email}
                    onChange={(e) => handleSocioChange(socio.id, 'email', e.target.value)}
                    placeholder="socio@email.com"
                  />

                  <Input
                    label="Telefone"
                    name={`socio-${socio.id}-telefone`}
                    type="tel"
                    value={socio.telefone}
                    onChange={(e) => handleSocioChange(socio.id, 'telefone', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />

                  {/* Endereço do Sócio */}
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-700 mb-3">Endereço do Sócio</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="CEP"
                        name={`socio-${socio.id}-cep`}
                        value={socio.endereco.cep}
                        onChange={(e) => handleSocioEnderecoChange(socio.id, 'cep', e.target.value)}
                        placeholder="00000-000"
                      />

                      <Input
                        label="Logradouro"
                        name={`socio-${socio.id}-logradouro`}
                        value={socio.endereco.logradouro}
                        onChange={(e) => handleSocioEnderecoChange(socio.id, 'logradouro', e.target.value)}
                        placeholder="Rua, Avenida, etc."
                      />

                      <Input
                        label="Número"
                        name={`socio-${socio.id}-numero`}
                        value={socio.endereco.numero}
                        onChange={(e) => handleSocioEnderecoChange(socio.id, 'numero', e.target.value)}
                        placeholder="123"
                      />

                      <Input
                        label="Bairro"
                        name={`socio-${socio.id}-bairro`}
                        value={socio.endereco.bairro}
                        onChange={(e) => handleSocioEnderecoChange(socio.id, 'bairro', e.target.value)}
                        placeholder="Nome do bairro"
                      />

                      <Input
                        label="Cidade"
                        name={`socio-${socio.id}-cidade`}
                        value={socio.endereco.cidade}
                        onChange={(e) => handleSocioEnderecoChange(socio.id, 'cidade', e.target.value)}
                        placeholder="Nome da cidade"
                      />

                      <Select
                        label="Estado (UF)"
                        name={`socio-${socio.id}-uf`}
                        value={socio.endereco.uf}
                        onChange={(e) => handleSocioEnderecoChange(socio.id, 'uf', e.target.value)}
                        options={estadosBrasileiros.map(uf => ({ value: uf, label: uf }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

        <Button type="submit" variant="primary">
          Próxima Etapa
        </Button>
      </div>
    </form>
  );
};
