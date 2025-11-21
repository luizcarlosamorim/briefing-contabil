import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Se Supabase não está configurado, usar apenas localStorage
        if (!isSupabaseConfigured) {
          console.warn('Supabase não configurado, usando localStorage');
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch (e) {
              localStorage.removeItem('user');
            }
          }
          setLoading(false);
          return;
        }

        // Verificar se há sessão ativa no Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Erro ao obter sessão:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          // Buscar perfil do usuário
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.email.split('@')[0],
            role: profile?.role || 'user',
          });
        } else {
          // Fallback: verificar localStorage (compatibilidade)
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch (e) {
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        // Fallback: verificar localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            localStorage.removeItem('user');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listener para mudanças de autenticação (apenas se Supabase configurado)
    let subscription = null;

    if (isSupabaseConfigured) {
      try {
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              const userData = {
                id: session.user.id,
                email: session.user.email,
                name: profile?.name || session.user.email.split('@')[0],
                role: profile?.role || 'user',
              };
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          }
        );
        subscription = data?.subscription;
      } catch (error) {
        console.error('Erro ao configurar listener de auth:', error);
      }
    }

    return () => {
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

      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.email.split('@')[0],
        role: profile?.role || 'user',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.session.access_token);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
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
        localStorage.setItem('user', JSON.stringify(userData));
        if (data.session) {
          localStorage.setItem('token', data.session.access_token);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
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
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
