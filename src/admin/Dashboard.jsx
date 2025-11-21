import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, FileText, Users, Settings, Eye, Loader } from 'lucide-react';
import { briefingsService } from '../services/supabase';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);

  // Carregar briefings ao montar o componente
  useEffect(() => {
    carregarBriefings();
  }, []);

  const carregarBriefings = async () => {
    try {
      setLoading(true);
      const response = await briefingsService.getAll();
      // Converter snake_case para camelCase para compatibilidade
      const briefingsFormatados = (response.data.data || []).map(b => ({
        id: b.id,
        protocolo: b.protocolo,
        nomeCliente: b.nome_cliente,
        cpfCnpj: b.cpf_cnpj,
        email: b.email,
        telefone: b.telefone,
        finalidade: b.finalidade,
        tipoEntidade: b.tipo_entidade,
        entidadeNome: b.entidade_nome,
        status: b.status,
        createdAt: b.created_at
      }));
      setBriefings(briefingsFormatados);
    } catch (error) {
      console.error('Erro ao carregar briefings do Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Sistema de Briefing Contábil
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Bem-vindo(a), {user?.name}!
          </h2>
          <p className="text-gray-600">
            Gerencie os briefings e configurações do sistema
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {loading ? <Loader className="animate-spin" size={24} /> : briefings.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Total de Briefings
            </h3>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
              <span className="text-3xl font-bold text-gray-900">1</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Usuários Ativos
            </h3>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Sistema
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              Role: {user?.role || 'user'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <FileText className="text-blue-600" size={20} />
              <div className="text-left">
                <p className="font-medium text-gray-900">Novo Briefing</p>
                <p className="text-xs text-gray-500">Criar novo briefing contábil</p>
              </div>
            </button>

            <button
              onClick={() => setShowList(!showList)}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <FileText className="text-green-600" size={20} />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {showList ? 'Ocultar Briefings' : 'Listar Briefings'}
                </p>
                <p className="text-xs text-gray-500">Ver todos os briefings cadastrados</p>
              </div>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <Users className="text-purple-600" size={20} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Gerenciar Usuários</p>
                  <p className="text-xs text-gray-500">Criar e gerenciar usuários administrativos</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Lista de Briefings */}
        {showList && (
          <div className="mt-8 bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Briefings Cadastrados ({briefings.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader className="animate-spin mx-auto text-blue-600" size={32} />
                  <p className="text-gray-500 mt-2">Carregando...</p>
                </div>
              ) : briefings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>Nenhum briefing cadastrado ainda</p>
                </div>
              ) : (
                briefings.map((briefing) => (
                  <div key={briefing.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-blue-600">
                            {briefing.protocolo}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            briefing.status === 'completo'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {briefing.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {briefing.nomeCliente}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {briefing.tipoEntidade} • {briefing.finalidade}
                        </p>
                        <p className="text-xs text-gray-500">
                          CPF/CNPJ: {briefing.cpfCnpj}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Criado em: {new Date(briefing.createdAt).toLocaleDateString('pt-BR')} às {new Date(briefing.createdAt).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/protocolo/${briefing.protocolo}`)}
                        className="ml-4 flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye size={16} />
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Status:</strong> Sistema operacional • Supabase conectado • Autenticação ativa
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
