-- ============================================
-- SUPABASE - Schema do Banco de Dados
-- ============================================
-- Execute este SQL no Supabase Dashboard:
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá em: SQL Editor (menu lateral)
-- 4. Cole todo este código
-- 5. Clique em "Run"
-- ============================================

-- Extensão para UUID (já vem ativa no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tabela: briefings
-- ============================================
CREATE TABLE IF NOT EXISTS briefings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo TEXT UNIQUE NOT NULL,
  nome_cliente TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  finalidade TEXT NOT NULL,
  tipo_entidade TEXT NOT NULL,
  entidade_nome TEXT NOT NULL,
  objeto_social TEXT,
  faturamento_estimado TEXT,
  capital_social TEXT,
  total_quotas TEXT,
  endereco JSONB NOT NULL DEFAULT '{}',
  inscricoes JSONB NOT NULL DEFAULT '{"estadual": false, "municipal": false, "especial": false}',
  socios JSONB DEFAULT '[]',
  documentos JSONB DEFAULT '[]',
  especificos JSONB DEFAULT '{}',
  status TEXT DEFAULT 'completo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_briefings_protocolo ON briefings(protocolo);
CREATE INDEX IF NOT EXISTS idx_briefings_cpf_cnpj ON briefings(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_briefings_email ON briefings(email);
CREATE INDEX IF NOT EXISTS idx_briefings_created_at ON briefings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefings_status ON briefings(status);

-- ============================================
-- Tabela: profiles (perfis de usuários)
-- ============================================
-- Esta tabela complementa auth.users do Supabase
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- Trigger: Atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para briefings
DROP TRIGGER IF EXISTS update_briefings_updated_at ON briefings;
CREATE TRIGGER update_briefings_updated_at
  BEFORE UPDATE ON briefings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Trigger: Criar perfil ao criar usuário
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Row Level Security (RLS) - Segurança
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Políticas para BRIEFINGS
-- ============================================

-- Qualquer um pode criar briefings (formulário público)
CREATE POLICY "Qualquer um pode criar briefings"
  ON briefings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Qualquer um pode ver briefings por protocolo (página de confirmação)
CREATE POLICY "Qualquer um pode ver briefings"
  ON briefings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Apenas usuários autenticados podem atualizar
CREATE POLICY "Usuários autenticados podem atualizar briefings"
  ON briefings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Apenas usuários autenticados podem deletar
CREATE POLICY "Usuários autenticados podem deletar briefings"
  ON briefings
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Políticas para PROFILES
-- ============================================

-- Usuário pode ver seu próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Usuário pode atualizar próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Dados iniciais (opcional)
-- ============================================

-- Inserir briefing de teste (opcional)
-- INSERT INTO briefings (protocolo, nome_cliente, cpf_cnpj, email, telefone, finalidade, tipo_entidade, entidade_nome, endereco)
-- VALUES (
--   'BRF-TESTE-0001',
--   'Empresa Teste LTDA',
--   '12.345.678/0001-90',
--   'teste@empresa.com',
--   '(11) 99999-9999',
--   'abertura',
--   'juridica',
--   'LTDA',
--   '{"cep": "01310-100", "logradouro": "Av Paulista", "numero": "1000", "bairro": "Bela Vista", "cidade": "São Paulo", "estado": "SP"}'
-- );

-- ============================================
-- PRONTO! Banco de dados configurado.
-- ============================================
-- Agora você pode:
-- 1. Criar um usuário admin via Authentication > Users
-- 2. Acessar o sistema e fazer login
-- ============================================
