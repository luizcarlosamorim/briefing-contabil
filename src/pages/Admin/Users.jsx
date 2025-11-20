import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Plus, Trash2, Edit, Shield, UserX, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import api from '../../services/api';

export const Users = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Verificar se é admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin') {
      alert('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/');
      return;
    }

    carregarUsuarios();
  }, [isAuthenticated, user, navigate]);

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const response = await api.get('/users');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      alert('Erro ao carregar usuários. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setFormData({
        name: usuario.name,
        email: usuario.email,
        password: '',
        role: usuario.role
      });
    } else {
      setUsuarioEditando(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.name || formData.name.trim() === '') {
      alert('Por favor, preencha o nome do usuário.');
      return;
    }

    if (!formData.email || formData.email.trim() === '') {
      alert('Por favor, preencha o e-mail do usuário.');
      return;
    }

    if (!usuarioEditando && (!formData.password || formData.password.length < 6)) {
      alert('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (usuarioEditando && formData.password && formData.password.length > 0 && formData.password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      if (usuarioEditando) {
        // Atualizar usuário
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password || dataToUpdate.password.trim() === '') {
          delete dataToUpdate.password; // Não atualizar senha se vazio
        }

        await api.patch(`/users/${usuarioEditando.id}`, dataToUpdate);
        alert('✅ Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        await api.post('/users', formData);
        alert('✅ Usuário criado com sucesso!');
      }

      fecharModal();
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);

      // Tratamento de erros mais específico
      if (error.response?.status === 401) {
        alert('❌ Erro de autenticação. Por favor, faça login novamente.');
      } else if (error.response?.status === 403) {
        alert('❌ Você não tem permissão para realizar esta ação.');
      } else if (error.response?.status === 409) {
        alert('❌ Este e-mail já está cadastrado no sistema. Use outro e-mail.');
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) {
          alert(`❌ Erro de validação:\n${message.join('\n')}`);
        } else {
          alert(`❌ ${message || 'Dados inválidos. Verifique os campos e tente novamente.'}`);
        }
      } else if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert('❌ Erro ao salvar usuário. Verifique sua conexão e tente novamente.');
      }
    }
  };

  const removerUsuario = async (id) => {
    if (id === user?.id) {
      alert('Você não pode remover seu próprio usuário!');
      return;
    }

    if (!window.confirm('Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      alert('Usuário removido com sucesso!');
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      alert('Erro ao remover usuário. Tente novamente.');
    }
  };

  const toggleAtivo = async (usuario) => {
    if (usuario.id === user?.id) {
      alert('Você não pode desativar seu próprio usuário!');
      return;
    }

    try {
      await api.patch(`/users/${usuario.id}`, {
        isActive: !usuario.isActive
      });
      alert(`Usuário ${usuario.isActive ? 'desativado' : 'ativado'} com sucesso!`);
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      alert('Erro ao alterar status do usuário. Tente novamente.');
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.name.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => navigate('/')}
            >
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <UsersIcon size={32} />
                Gerenciamento de Usuários
              </h1>
              <p className="text-gray-600 mt-1">
                Crie e gerencie usuários administrativos do sistema
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => abrirModal()}
          >
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-600">Total de Usuários</p>
            <p className="text-3xl font-bold text-gray-900">{usuarios.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-600">Administradores</p>
            <p className="text-3xl font-bold text-blue-600">
              {usuarios.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-600">Usuários Comuns</p>
            <p className="text-3xl font-bold text-green-600">
              {usuarios.filter(u => u.role === 'user').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-600">Ativos</p>
            <p className="text-3xl font-bold text-emerald-600">
              {usuarios.filter(u => u.isActive).length}
            </p>
          </div>
        </div>

        {/* Filtro */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {filtro ? 'Nenhum usuário encontrado com este filtro.' : 'Nenhum usuário cadastrado.'}
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className={!usuario.isActive ? 'bg-gray-50 opacity-60' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.name}
                            {usuario.id === user?.id && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Você
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{usuario.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.role === 'admin' ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          <Shield size={14} className="mr-1" />
                          Administrador
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Usuário
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAtivo(usuario)}
                        disabled={usuario.id === user?.id}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usuario.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        } ${usuario.id === user?.id ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-75'}`}
                      >
                        {usuario.isActive ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModal(usuario)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => removerUsuario(usuario.id)}
                          disabled={usuario.id === user?.id}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remover"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome Completo"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="João Silva"
              />

              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="joao@exemplo.com"
              />

              <Input
                label={usuarioEditando ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!usuarioEditando}
                placeholder="••••••••"
                helpText={usuarioEditando ? 'Deixe em branco para não alterar a senha' : 'Mínimo 6 caracteres'}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={fecharModal}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {usuarioEditando ? 'Atualizar' : 'Criar'} Usuário
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
