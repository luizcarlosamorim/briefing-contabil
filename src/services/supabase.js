// ============================================
// Configuração do Supabase
// ============================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Flag para verificar se Supabase está configurado corretamente
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://')
)

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase não configurado corretamente.')
  console.warn('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY na Vercel.')
  console.warn('URL atual:', supabaseUrl || '(vazio)')
}

// URL padrão válida para evitar erro de inicialização
const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MjAsImV4cCI6MTk2MDc2ODgyMH0.placeholder'

// Criar cliente Supabase (usa fallback se não configurado para evitar crash)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : FALLBACK_URL,
  isSupabaseConfigured ? supabaseAnonKey : FALLBACK_KEY,
  {
    auth: {
      // Persistir sessão no localStorage
      persistSession: true,
      // Usar localStorage para armazenar a sessão
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      // Auto-refresh do token
      autoRefreshToken: true,
      // Detectar sessão em outras abas
      detectSessionInUrl: true,
      // Chave customizada para o localStorage
      storageKey: 'briefing-auth-token',
    }
  }
)

// ============================================
// Funções de Briefings
// ============================================

export const briefingsService = {
  // Criar novo briefing
  async create(briefingData) {
    // Gerar protocolo único
    const protocolo = `BRF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    const { data, error } = await supabase
      .from('briefings')
      .insert({
        protocolo,
        nome_cliente: briefingData.nomeCliente,
        cpf_cnpj: briefingData.cpfCnpj,
        email: briefingData.email,
        telefone: briefingData.telefone,
        finalidade: briefingData.finalidade,
        tipo_entidade: briefingData.tipoEntidade,
        entidade_nome: briefingData.entidadeNome,
        objeto_social: briefingData.objetoSocial,
        faturamento_estimado: briefingData.faturamentoEstimado || '',
        capital_social: briefingData.capitalSocial || '',
        total_quotas: briefingData.totalQuotas || '',
        endereco: briefingData.endereco,
        inscricoes: briefingData.inscricoes,
        socios: briefingData.socios || [],
        documentos: briefingData.documentos || [],
        especificos: briefingData.especificos || {},
        status: briefingData.status || 'completo'
      })
      .select()
      .single()

    if (error) throw error
    return { data: { ...data, protocolo: data.protocolo } }
  },

  // Buscar todos os briefings
  async getAll() {
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: { data: data || [] } }
  },

  // Buscar briefing por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data }
  },

  // Buscar briefing por protocolo (acesso público)
  async getByProtocolo(protocolo) {
    console.log('[Supabase] Buscando protocolo:', protocolo)
    console.log('[Supabase] Configurado:', isSupabaseConfigured)

    if (!isSupabaseConfigured) {
      throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
    }

    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .eq('protocolo', protocolo)
      .single()

    console.log('[Supabase] Resultado:', { data: !!data, error: error?.message })

    if (error) {
      console.error('[Supabase] Erro detalhado:', error)
      throw error
    }
    return { data }
  },

  // Atualizar briefing
  async update(id, briefingData) {
    const { data, error } = await supabase
      .from('briefings')
      .update({
        nome_cliente: briefingData.nomeCliente,
        cpf_cnpj: briefingData.cpfCnpj,
        email: briefingData.email,
        telefone: briefingData.telefone,
        finalidade: briefingData.finalidade,
        tipo_entidade: briefingData.tipoEntidade,
        entidade_nome: briefingData.entidadeNome,
        objeto_social: briefingData.objetoSocial,
        faturamento_estimado: briefingData.faturamentoEstimado,
        capital_social: briefingData.capitalSocial,
        total_quotas: briefingData.totalQuotas,
        endereco: briefingData.endereco,
        inscricoes: briefingData.inscricoes,
        socios: briefingData.socios,
        documentos: briefingData.documentos,
        especificos: briefingData.especificos,
        status: briefingData.status
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data }
  },

  // Deletar briefing
  async delete(id) {
    const { error } = await supabase
      .from('briefings')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  },

  // Exportar para Excel (retorna dados formatados)
  async exportToExcel() {
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: data || [] }
  }
}

// ============================================
// Funções de Autenticação
// ============================================

export const authService = {
  // Login com email e senha
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { data }
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Verificar se está autenticado
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  },

  // Registrar novo usuário (apenas admin pode fazer isso via Supabase Dashboard)
  async register(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) throw error
    return { data }
  }
}

// ============================================
// Funções de Usuários (perfis)
// ============================================

export const usersService = {
  // Buscar todos os usuários (perfis)
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: data || [] }
  },

  // Buscar usuário por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data }
  },

  // Atualizar perfil
  async update(id, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data }
  }
}

export default supabase
