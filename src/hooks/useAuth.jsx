import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Função para carregar dados do usuário a partir da sessão
  const loadUserFromSession = useCallback(async (session) => {
    if (!session?.user) {
      return null;
    }

    try {
      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const userData = {
        id: session.user.id,
        email: session.user.email,
        name: profile?.name || session.user.user_metadata?.name || session.user.email.split('@')[0],
        role: profile?.role || session.user.user_metadata?.role || 'user',
      };

      return userData;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      // Retorna dados básicos mesmo se não conseguir buscar o perfil
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email.split('@')[0],
        role: session.user.user_metadata?.role || 'user',
      };
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('[Auth] Inicializando autenticação...');

        // Se Supabase não está configurado, usar apenas localStorage
        if (!isSupabaseConfigured) {
          console.warn('[Auth] Supabase não configurado, usando localStorage');
          const savedUser = localStorage.getItem('briefing-user-data');
          if (savedUser && mounted) {
            try {
              setUser(JSON.parse(savedUser));
            } catch (e) {
              localStorage.removeItem('briefing-user-data');
            }
          }
          setLoading(false);
          setSessionChecked(true);
          return;
        }

        // Verificar se há sessão ativa no Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[Auth] Erro ao obter sessão:', sessionError);
        }

        if (session?.user && mounted) {
          console.log('[Auth] Sessão encontrada:', session.user.email);
          const userData = await loadUserFromSession(session);
          if (userData && mounted) {
            setUser(userData);
            // Salvar no localStorage como backup
            localStorage.setItem('briefing-user-data', JSON.stringify(userData));
          }
        } else {
          console.log('[Auth] Nenhuma sessão ativa');
          // Tentar recuperar do localStorage como fallback
          const savedUser = localStorage.getItem('briefing-user-data');
          if (savedUser && mounted) {
            try {
              const parsedUser = JSON.parse(savedUser);
              console.log('[Auth] Usuário recuperado do localStorage:', parsedUser.email);
              setUser(parsedUser);
            } catch (e) {
              localStorage.removeItem('briefing-user-data');
            }
          }
        }
      } catch (error) {
        console.error('[Auth] Erro ao inicializar:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setSessionChecked(true);
        }
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    let subscription = null;

    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('[Auth] Estado alterado:', event);

          if (!mounted) return;

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              const userData = await loadUserFromSession(session);
              if (userData && mounted) {
                setUser(userData);
                localStorage.setItem('briefing-user-data', JSON.stringify(userData));
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('briefing-user-data');
          }
        }
      );
      subscription = data?.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [loadUserFromSession]);

  const login = async (email, password) => {
    try {
      if (!isSupabaseConfigured) {
        return {
          success: false,
          error: 'Supabase não configurado. Configure as variáveis de ambiente.',
        };
      }

      console.log('[Auth] Tentando login:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('[Auth] Login bem-sucedido');

      // Carregar dados do usuário
      const userData = await loadUserFromSession(data.session);

      if (userData) {
        setUser(userData);
        localStorage.setItem('briefing-user-data', JSON.stringify(userData));
      }

      return { success: true };
    } catch (error) {
      console.error('[Auth] Erro no login:', error);
      return {
        success: false,
        error: error.message || 'Erro ao fazer login',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      if (!isSupabaseConfigured) {
        return {
          success: false,
          error: 'Supabase não configurado. Configure as variáveis de ambiente.',
        };
      }

      console.log('[Auth] Tentando registrar:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: 'user' },
        },
      });

      if (error) throw error;

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: name,
          role: 'user',
        };

        setUser(userData);
        localStorage.setItem('briefing-user-data', JSON.stringify(userData));
      }

      console.log('[Auth] Registro bem-sucedido');
      return { success: true };
    } catch (error) {
      console.error('[Auth] Erro no registro:', error);
      return {
        success: false,
        error: error.message || 'Erro ao registrar',
      };
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth] Fazendo logout...');
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('[Auth] Erro no logout:', error);
    } finally {
      localStorage.removeItem('briefing-user-data');
      localStorage.removeItem('briefing-auth-token');
      setUser(null);
      console.log('[Auth] Logout concluído');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
