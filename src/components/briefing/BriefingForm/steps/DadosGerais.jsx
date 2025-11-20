import React from 'react';
import { User, Mail, Phone, FileText } from 'lucide-react';
import { useBriefing } from '../../../../contexts/BriefingContext';
import { Input, Select } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { finalidadesBriefing } from '../../../../constants/briefingData';

export const DadosGerais = () => {
  const { dados, atualizarDados, proximaEtapa } = useBriefing();

  const handleChange = (campo, valor) => {
    atualizarDados('dadosGerais', campo, valor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    proximaEtapa();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dados do Solicitante
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome Completo"
            name="nomeCliente"
            value={dados.dadosGerais.nomeCliente}
            onChange={(e) => handleChange('nomeCliente', e.target.value)}
            placeholder="Digite o nome completo"
            icon={User}
            required
          />

          <Input
            label="CPF ou CNPJ"
            name="cpfCnpj"
            value={dados.dadosGerais.cpfCnpj}
            onChange={(e) => handleChange('cpfCnpj', e.target.value)}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            required
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            value={dados.dadosGerais.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="seu@email.com"
            icon={Mail}
            required
          />

          <Input
            label="Telefone/WhatsApp"
            name="telefone"
            type="tel"
            value={dados.dadosGerais.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            icon={Phone}
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Finalidade do Briefing
        </h3>

        <Select
          label="Qual o objetivo deste briefing?"
          name="finalidade"
          value={dados.dadosGerais.finalidade}
          onChange={(e) => handleChange('finalidade', e.target.value)}
          options={finalidadesBriefing}
          required
          helpText="Selecione o tipo de serviço que você precisa"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Próxima Etapa
        </Button>
      </div>
    </form>
  );
};
