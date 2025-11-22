import React from 'react';
import { ArrowLeft, Search, Building, MapPin } from 'lucide-react';
import { useBriefing } from '../../../../contexts/BriefingContext';
import { useCNPJ } from '../../../../hooks/useCNPJ';
import { useCEP } from '../../../../hooks/useCEP';
import { useModal } from '../../../ui/Modal';
import { useToast } from '../../../ui/Toast';
import { Input, Select, Textarea } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { InlineLoading } from '../../../common/Loading';
import { estadosBrasileiros, tiposImovel } from '../../../../constants/briefingData';

export const DadosEntidade = () => {
  const { dados, setDados, atualizarDados, proximaEtapa, etapaAnterior } = useBriefing();
  const { buscandoCNPJ, erro, buscarDadosCNPJ, preencherDadosCNPJ, importarSocios, criarResumo, limparErro } = useCNPJ();
  const { buscandoCEP, erro: erroCEP, buscarDadosCEP, limparErro: limparErroCEP } = useCEP();
  const modal = useModal();
  const toast = useToast();
  const [cnpjBusca, setCnpjBusca] = React.useState('');

  const handleChange = (campo, valor) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleEnderecoChange = (campo, valor) => {
    atualizarDados('endereco', campo, valor);
  };

  const handleBuscarCNPJ = async () => {
    if (!cnpjBusca.trim()) return;

    const dadosCNPJ = await buscarDadosCNPJ(cnpjBusca);

    if (dadosCNPJ) {
      // Criar resumo formatado para exibição
      const resumoTexto = `Razão Social: ${dadosCNPJ.nome}\n${dadosCNPJ.fantasia ? `Nome Fantasia: ${dadosCNPJ.fantasia}\n` : ''}CNPJ: ${dadosCNPJ.cnpj}\nSituação: ${dadosCNPJ.situacao}\n\nEndereço:\n${dadosCNPJ.logradouro}, ${dadosCNPJ.numero}\n${dadosCNPJ.bairro} - ${dadosCNPJ.municipio}/${dadosCNPJ.uf}\nCEP: ${dadosCNPJ.cep}`;

      const confirmar = await modal.confirm(
        'CNPJ Encontrado',
        `${resumoTexto}\n\nDeseja preencher automaticamente o formulário com estes dados?`,
        { confirmText: 'Preencher', cancelText: 'Cancelar' }
      );

      if (confirmar) {
        preencherDadosCNPJ(dadosCNPJ);
        toast.success('Dados do CNPJ preenchidos com sucesso!', 'Dados importados');

        // Verificar se há sócios para importar
        if (dadosCNPJ.qsa && dadosCNPJ.qsa.length > 0) {
          const confirmarSocios = await modal.confirm(
            'Importar Sócios',
            `Foram encontrados ${dadosCNPJ.qsa.length} sócio(s) no Quadro de Sócios e Administradores.\n\nDeseja importá-los automaticamente?`,
            { confirmText: 'Importar', cancelText: 'Não' }
          );

          if (confirmarSocios) {
            importarSocios(dadosCNPJ);
            toast.success(`${dadosCNPJ.qsa.length} sócio(s) importado(s) com sucesso!`, 'Sócios importados');
          }
        }
      }
    }
  };

  const handleBuscarCEP = async () => {
    const cep = dados.endereco.cep;
    if (cep && cep.trim()) {
      await buscarDadosCEP(cep, (dadosCEP) => {
        // Preenche automaticamente os campos do endereço
        atualizarDados('endereco', 'logradouro', dadosCEP.logradouro);
        atualizarDados('endereco', 'bairro', dadosCEP.bairro);
        atualizarDados('endereco', 'cidade', dadosCEP.cidade);
        atualizarDados('endereco', 'uf', dadosCEP.uf);
        if (dadosCEP.complemento) {
          atualizarDados('endereco', 'complemento', dadosCEP.complemento);
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    proximaEtapa();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Busca de CNPJ */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Search size={18} />
          Buscar dados por CNPJ (Opcional)
        </h4>
        <p className="text-sm text-blue-700 mb-3">
          Se a empresa já possui CNPJ, podemos buscar os dados automaticamente
        </p>

        <div className="flex gap-2">
          <Input
            name="cnpjBusca"
            value={cnpjBusca}
            onChange={(e) => {
              setCnpjBusca(e.target.value);
              limparErro();
            }}
            placeholder="00.000.000/0000-00"
            className="flex-1"
            disabled={buscandoCNPJ}
          />
          <Button
            type="button"
            onClick={handleBuscarCNPJ}
            disabled={!cnpjBusca.trim() || buscandoCNPJ}
            variant="primary"
          >
            {buscandoCNPJ ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>

        {buscandoCNPJ && (
          <div className="mt-3">
            <InlineLoading message="Consultando CNPJ na Receita Federal..." />
          </div>
        )}

        {erro && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {erro}
          </div>
        )}
      </div>

      {/* Dados da Entidade */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building size={20} />
          Dados da Entidade
        </h3>

        <div className="space-y-4">
          <Input
            label="Nome/Razão Social"
            name="entidadeNome"
            value={dados.entidadeNome}
            onChange={(e) => handleChange('entidadeNome', e.target.value)}
            placeholder="Nome da empresa ou entidade"
            required
          />

          <Textarea
            label="Objeto Social / Atividade Principal"
            name="objetoSocial"
            value={dados.objetoSocial}
            onChange={(e) => handleChange('objetoSocial', e.target.value)}
            placeholder="Descreva as atividades principais da entidade"
            rows={3}
            required
            helpText="Exemplo: Comércio de produtos eletrônicos, Prestação de serviços de consultoria, etc."
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Endereço
        </h3>

        {/* Busca de CEP */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700 mb-3">
            Digite o CEP e clique em "Buscar" para preencher automaticamente
          </p>
          <div className="flex gap-2">
            <Input
              label="CEP"
              name="cep"
              value={dados.endereco.cep}
              onChange={(e) => {
                handleEnderecoChange('cep', e.target.value);
                limparErroCEP();
              }}
              placeholder="00000-000"
              required
              disabled={buscandoCEP}
              className="flex-1"
            />
            <div className="pt-6">
              <Button
                type="button"
                onClick={handleBuscarCEP}
                disabled={!dados.endereco.cep || buscandoCEP}
                variant="primary"
                icon={Search}
              >
                {buscandoCEP ? 'Buscando...' : 'Buscar CEP'}
              </Button>
            </div>
          </div>

          {buscandoCEP && (
            <div className="mt-3">
              <InlineLoading message="Consultando CEP..." />
            </div>
          )}

          {erroCEP && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {erroCEP}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            label="Logradouro"
            name="logradouro"
            value={dados.endereco.logradouro}
            onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
            placeholder="Rua, Avenida, etc."
            required
            className="md:col-span-2"
          />

          <Input
            label="Número"
            name="numero"
            value={dados.endereco.numero}
            onChange={(e) => handleEnderecoChange('numero', e.target.value)}
            placeholder="123"
            required
          />

          <Input
            label="Complemento"
            name="complemento"
            value={dados.endereco.complemento}
            onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
            placeholder="Sala, Andar, etc. (opcional)"
          />

          <Input
            label="Bairro"
            name="bairro"
            value={dados.endereco.bairro}
            onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
            placeholder="Nome do bairro"
            required
          />

          <Input
            label="Cidade"
            name="cidade"
            value={dados.endereco.cidade}
            onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
            placeholder="Nome da cidade"
            required
          />

          <Select
            label="Estado (UF)"
            name="uf"
            value={dados.endereco.uf}
            onChange={(e) => handleEnderecoChange('uf', e.target.value)}
            options={estadosBrasileiros.map(uf => ({ value: uf, label: uf }))}
            required
          />

          <Select
            label="Tipo de Imóvel"
            name="tipoImovel"
            value={dados.endereco.tipoImovel}
            onChange={(e) => handleEnderecoChange('tipoImovel', e.target.value)}
            options={tiposImovel}
            required
          />
        </div>
      </div>

      {/* Inscrições Fiscais */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Inscrições Fiscais e Cadastrais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Inscrição Estadual"
            name="inscricaoEstadual"
            value={dados.endereco.inscricaoEstadual || ''}
            onChange={(e) => handleEnderecoChange('inscricaoEstadual', e.target.value)}
            placeholder="000.000.000.000"
            helpText="Número da inscrição estadual (se aplicável)"
          />

          <Input
            label="Inscrição Municipal"
            name="inscricaoMunicipal"
            value={dados.endereco.inscricaoMunicipal || ''}
            onChange={(e) => handleEnderecoChange('inscricaoMunicipal', e.target.value)}
            placeholder="0000000-0"
            helpText="Número da inscrição municipal (se aplicável)"
          />

          <Input
            label="Cadastro Imobiliário / IPTU"
            name="cadastroImobiliario"
            value={dados.endereco.cadastroImobiliario || ''}
            onChange={(e) => handleEnderecoChange('cadastroImobiliario', e.target.value)}
            placeholder="000.000.0000-0"
            helpText="Número do cadastro imobiliário do imóvel"
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Capital Social */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Capital Social
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Capital Social Total"
            name="capitalSocial"
            type="text"
            value={dados.capitalSocial || ''}
            onChange={(e) => handleChange('capitalSocial', e.target.value)}
            placeholder="R$ 0,00"
            helpText="Valor total do capital social da empresa"
            required
          />

          <Input
            label="Quantidade Total de Quotas"
            name="totalQuotas"
            type="number"
            value={dados.totalQuotas || ''}
            onChange={(e) => handleChange('totalQuotas', e.target.value)}
            placeholder="1000"
            helpText="Número total de quotas/ações da empresa"
            required
          />
        </div>

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <strong>Importante:</strong> As quotas de cada sócio serão definidas na próxima etapa.
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

        <Button type="submit" variant="primary">
          Próxima Etapa
        </Button>
      </div>
    </form>
  );
};
