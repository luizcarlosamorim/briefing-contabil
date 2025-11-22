import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Inicializar com dados do localStorage para evitar flash de loading
    try {
      const saved = localStorage.getItem('briefing-user-data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Função para carregar dados do usuário a partir da sessão
  const loadUserFromSession = async (session) => {
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

      return {
        id: session.user.id,
        email: session.user.email,
        name: profile?.name || session.user.user_metadata?.name || session.user.email.split('@')[0],
        role: profile?.role || session.user.user_metadata?.role || 'user',
      };
    } catch (error) {
      // Retorna dados básicos mesmo se não conseguir buscar o perfil
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email.split('@')[0],
        role: session.user.user_metadata?.role || 'user',
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // Timeout de segurança - nunca ficar em loading mais de 5 segundos
      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('[Auth] Timeout - finalizando loading');
          setLoading(false);
        }
      }, 5000);

      try {
        // Se Supabase não está configurado, usar apenas localStorage
        if (!isSupabaseConfigured) {
          console.warn('[Auth] Supabase não configurado');
          if (mounted) setLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        // Verificar se há sessão ativa no Supabase
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const userData = await loadUserFromSession(session);
          if (userData && mounted) {
            setUser(userData);
            localStorage.setItem('briefing-user-data', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('[Auth] Erro ao inicializar:', error);
      } finally {
        clearTimeout(timeoutId);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    let subscription = null;

    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      });
      subscription = data?.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      if (!isSupabaseConfigured) {
        return {
          success: false,
          error: 'Supabase não configurado. Configure as variáveis de ambiente.',
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('[Auth] Erro no logout:', error);
    } finally {
      localStorage.removeItem('briefing-user-data');
      setUser(null);
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
