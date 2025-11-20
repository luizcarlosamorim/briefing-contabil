import React from 'react';
import { ArrowLeft, CheckCircle, FileEdit, Activity, Home, Plus, Trash2 } from 'lucide-react';
import { useBriefing } from '../../../../contexts/BriefingContext';
import { Checkbox, Input, Select, Textarea } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { regimesTributarios, faixasFaturamento } from '../../../../constants/briefingData';

export const InformacoesEspecificas = () => {
  const { dados, atualizarDados, tipoEntidade, proximaEtapa, etapaAnterior } = useBriefing();

  const [cnaes, setCnaes] = React.useState(dados.especificos.cnaes || []);
  const [novoCnae, setNovoCnae] = React.useState('');
  const [descricaoCnae, setDescricaoCnae] = React.useState('');

  const [bensImoveis, setBensImoveis] = React.useState(dados.especificos.bensImoveis || []);

  const handleInscricoesChange = (campo, valor) => {
    atualizarDados('inscricoes', campo, valor);
  };

  const handleEspecificoChange = (campo, valor) => {
    atualizarDados('especificos', {
      ...dados.especificos,
      [campo]: valor
    });
  };

  const adicionarCnae = () => {
    if (novoCnae.trim() && descricaoCnae.trim()) {
      const novosCnaes = [
        ...cnaes,
        {
          id: Date.now(),
          codigo: novoCnae,
          descricao: descricaoCnae
        }
      ];
      setCnaes(novosCnaes);
      handleEspecificoChange('cnaes', novosCnaes);
      setNovoCnae('');
      setDescricaoCnae('');
    }
  };

  const removerCnae = (id) => {
    const novosCnaes = cnaes.filter(cnae => cnae.id !== id);
    setCnaes(novosCnaes);
    handleEspecificoChange('cnaes', novosCnaes);
  };

  const adicionarBemImovel = () => {
    const novosBens = [
      ...bensImoveis,
      {
        id: Date.now(),
        descricao: '',
        matricula: '',
        valor: '',
        endereco: ''
      }
    ];
    setBensImoveis(novosBens);
    handleEspecificoChange('bensImoveis', novosBens);
  };

  const atualizarBemImovel = (id, campo, valor) => {
    const novosBens = bensImoveis.map(bem =>
      bem.id === id ? { ...bem, [campo]: valor } : bem
    );
    setBensImoveis(novosBens);
    handleEspecificoChange('bensImoveis', novosBens);
  };

  const removerBemImovel = (id) => {
    const novosBens = bensImoveis.filter(bem => bem.id !== id);
    setBensImoveis(novosBens);
    handleEspecificoChange('bensImoveis', novosBens);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    proximaEtapa();
  };

  const renderCamposEspecificos = () => {
    switch (tipoEntidade) {
      case 'holding':
        return (
          <div className="space-y-4">
            <Textarea
              label="Empresas Controladas"
              name="empresasControladas"
              value={dados.especificos.empresasControladas || ''}
              onChange={(e) => handleEspecificoChange('empresasControladas', e.target.value)}
              placeholder="Liste as empresas que serão controladas pela holding"
              rows={3}
            />
            <Input
              label="Patrimônio Total Estimado"
              name="patrimonioTotal"
              value={dados.especificos.patrimonioTotal || ''}
              onChange={(e) => handleEspecificoChange('patrimonioTotal', e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>
        );

      case 'sa':
        return (
          <div className="space-y-4">
            <Input
              label="Capital Social"
              name="capitalSocial"
              value={dados.especificos.capitalSocial || ''}
              onChange={(e) => handleEspecificoChange('capitalSocial', e.target.value)}
              placeholder="R$ 0,00"
              required
            />
            <Input
              label="Quantidade de Ações"
              name="quantidadeAcoes"
              type="number"
              value={dados.especificos.quantidadeAcoes || ''}
              onChange={(e) => handleEspecificoChange('quantidadeAcoes', e.target.value)}
              placeholder="0"
            />
            <Select
              label="Tipo de S.A."
              name="tipoSA"
              value={dados.especificos.tipoSA || ''}
              onChange={(e) => handleEspecificoChange('tipoSA', e.target.value)}
              options={[
                { value: 'aberta', label: 'Sociedade Anônima de Capital Aberto' },
                { value: 'fechada', label: 'Sociedade Anônima de Capital Fechado' }
              ]}
            />
          </div>
        );

      case 'spe':
        return (
          <div className="space-y-4">
            <Textarea
              label="Objetivo Específico da SPE"
              name="objetivoSPE"
              value={dados.especificos.objetivoSPE || ''}
              onChange={(e) => handleEspecificoChange('objetivoSPE', e.target.value)}
              placeholder="Descreva o propósito específico da SPE"
              rows={3}
              required
            />
            <Input
              label="Prazo de Duração do Projeto"
              name="prazoDuracao"
              value={dados.especificos.prazoDuracao || ''}
              onChange={(e) => handleEspecificoChange('prazoDuracao', e.target.value)}
              placeholder="Ex: 5 anos"
            />
          </div>
        );

      case 'associacao':
      case 'oscip':
        return (
          <div className="space-y-4">
            <Textarea
              label="Finalidade Social"
              name="finalidadeSocial"
              value={dados.especificos.finalidadeSocial || ''}
              onChange={(e) => handleEspecificoChange('finalidadeSocial', e.target.value)}
              placeholder="Descreva a finalidade social da entidade"
              rows={3}
              required
            />
            <Input
              label="Número de Associados/Membros"
              name="numeroMembros"
              type="number"
              value={dados.especificos.numeroMembros || ''}
              onChange={(e) => handleEspecificoChange('numeroMembros', e.target.value)}
              placeholder="0"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={20} />
          Regime Tributário e Inscrições
        </h3>

        <div className="space-y-4">
          <Select
            label="Regime Tributário Pretendido"
            name="regimeTributario"
            value={dados.especificos.regimeTributario || ''}
            onChange={(e) => handleEspecificoChange('regimeTributario', e.target.value)}
            options={regimesTributarios}
            helpText="Caso não saiba, podemos orientar posteriormente"
          />

          <Select
            label="Faixa de Faturamento Anual"
            name="faixaFaturamento"
            value={dados.especificos.faixaFaturamento || ''}
            onChange={(e) => handleEspecificoChange('faixaFaturamento', e.target.value)}
            options={faixasFaturamento}
          />

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Inscrições Necessárias</h4>
            <div className="space-y-2">
              <Checkbox
                label="Inscrição Estadual"
                name="inscricaoEstadual"
                checked={dados.inscricoes.estadual}
                onChange={(e) => handleInscricoesChange('estadual', e.target.checked)}
              />
              <Checkbox
                label="Inscrição Municipal"
                name="inscricaoMunicipal"
                checked={dados.inscricoes.municipal}
                onChange={(e) => handleInscricoesChange('municipal', e.target.checked)}
              />
              <Checkbox
                label="Inscrição Especial / Específica"
                name="inscricaoEspecial"
                checked={dados.inscricoes.especial}
                onChange={(e) => handleInscricoesChange('especial', e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Campos específicos por tipo de entidade */}
      {tipoEntidade && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações Específicas - {tipoEntidade.toUpperCase()}
          </h3>
          {renderCamposEspecificos()}
        </div>
      )}

      {/* Eventos/Atos de Alteração */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileEdit size={20} />
          Eventos/Atos de Alteração (Junta Comercial)
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Selecione os tipos de alterações que serão registradas na Junta Comercial:
        </p>

        <div className="space-y-2">
          <Checkbox
            label="Alteração de Endereço"
            name="alteracaoEndereco"
            checked={dados.especificos.alteracaoEndereco || false}
            onChange={(e) => handleEspecificoChange('alteracaoEndereco', e.target.checked)}
          />
          <Checkbox
            label="Alteração de Sócios/Quadro Societário"
            name="alteracaoSocios"
            checked={dados.especificos.alteracaoSocios || false}
            onChange={(e) => handleEspecificoChange('alteracaoSocios', e.target.checked)}
          />
          <Checkbox
            label="Alteração de Capital Social"
            name="alteracaoCapital"
            checked={dados.especificos.alteracaoCapital || false}
            onChange={(e) => handleEspecificoChange('alteracaoCapital', e.target.checked)}
          />
          <Checkbox
            label="Alteração de Atividades (CNAEs)"
            name="alteracaoAtividades"
            checked={dados.especificos.alteracaoAtividades || false}
            onChange={(e) => handleEspecificoChange('alteracaoAtividades', e.target.checked)}
          />
          <Checkbox
            label="Alteração de Nome/Razão Social"
            name="alteracaoNome"
            checked={dados.especificos.alteracaoNome || false}
            onChange={(e) => handleEspecificoChange('alteracaoNome', e.target.checked)}
          />
          <Checkbox
            label="Alteração de Objeto Social"
            name="alteracaoObjeto"
            checked={dados.especificos.alteracaoObjeto || false}
            onChange={(e) => handleEspecificoChange('alteracaoObjeto', e.target.checked)}
          />
        </div>
      </div>

      {/* CNAEs / Atividades */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={20} />
          CNAEs / Atividades Econômicas
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Adicione os CNAEs (Classificação Nacional de Atividades Econômicas) da empresa:
        </p>

        <div className="flex gap-2 mb-4">
          <Input
            label="Código CNAE"
            name="novoCnae"
            value={novoCnae}
            onChange={(e) => setNovoCnae(e.target.value)}
            placeholder="0000-0/00"
            className="flex-1"
          />
          <Input
            label="Descrição"
            name="descricaoCnae"
            value={descricaoCnae}
            onChange={(e) => setDescricaoCnae(e.target.value)}
            placeholder="Descrição da atividade"
            className="flex-[2]"
          />
          <div className="pt-6">
            <Button
              type="button"
              onClick={adicionarCnae}
              variant="primary"
              icon={Plus}
            >
              Adicionar
            </Button>
          </div>
        </div>

        {cnaes.length > 0 && (
          <div className="space-y-2">
            {cnaes.map((cnae) => (
              <div key={cnae.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium text-gray-900">{cnae.codigo}</span>
                  <span className="text-gray-600 ml-2">- {cnae.descricao}</span>
                </div>
                <Button
                  type="button"
                  onClick={() => removerCnae(cnae.id)}
                  variant="danger"
                  icon={Trash2}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bens Imóveis (apenas para Holdings) */}
      {tipoEntidade === 'holding' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home size={20} />
            Bens Imóveis da Holding
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Registre os bens imóveis que farão parte do patrimônio da holding:
          </p>

          <Button
            type="button"
            onClick={adicionarBemImovel}
            variant="primary"
            icon={Plus}
            className="mb-4"
          >
            Adicionar Bem Imóvel
          </Button>

          {bensImoveis.length > 0 && (
            <div className="space-y-4">
              {bensImoveis.map((bem, index) => (
                <div key={bem.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Imóvel #{index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removerBemImovel(bem.id)}
                      variant="danger"
                      icon={Trash2}
                    >
                      Remover
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Descrição do Imóvel"
                      value={bem.descricao}
                      onChange={(e) => atualizarBemImovel(bem.id, 'descricao', e.target.value)}
                      placeholder="Ex: Casa, Apartamento, Terreno..."
                      className="md:col-span-2"
                    />

                    <Input
                      label="Matrícula do Imóvel"
                      value={bem.matricula}
                      onChange={(e) => atualizarBemImovel(bem.id, 'matricula', e.target.value)}
                      placeholder="Número da matrícula no cartório"
                    />

                    <Input
                      label="Valor Estimado"
                      value={bem.valor}
                      onChange={(e) => atualizarBemImovel(bem.id, 'valor', e.target.value)}
                      placeholder="R$ 0,00"
                    />

                    <Input
                      label="Endereço Completo"
                      value={bem.endereco}
                      onChange={(e) => atualizarBemImovel(bem.id, 'endereco', e.target.value)}
                      placeholder="Endereço completo do imóvel"
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Observações adicionais */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Observações Adicionais
        </h3>
        <Textarea
          label="Informações Complementares"
          name="observacoes"
          value={dados.especificos.observacoes || ''}
          onChange={(e) => handleEspecificoChange('observacoes', e.target.value)}
          placeholder="Adicione qualquer informação adicional que considere relevante"
          rows={4}
        />
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
          Ir para Revisão
        </Button>
      </div>
    </form>
  );
};
