import { IsNotEmpty, IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateSocioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @IsString()
  @IsOptional()
  qualificacao?: string;

  @IsOptional()
  quotas?: string;

  @IsOptional()
  percentual?: string;

  @IsOptional()
  ehAdministrador?: boolean;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsObject()
  @IsOptional()
  endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  };
}

export class CreateBriefingDto {
  @IsString()
  @IsNotEmpty()
  nomeCliente: string;

  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsString()
  @IsNotEmpty()
  finalidade: string;

  @IsString()
  @IsNotEmpty()
  tipoEntidade: string;

  @IsString()
  @IsNotEmpty()
  entidadeNome: string;

  @IsObject()
  @IsNotEmpty()
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    tipoImovel: string;
    inscricaoEstadual?: string;
    inscricaoMunicipal?: string;
    cadastroImobiliario?: string;
  };

  @IsString()
  @IsNotEmpty()
  objetoSocial: string;

  @IsString()
  @IsOptional()
  faturamentoEstimado?: string;

  @IsString()
  @IsOptional()
  capitalSocial?: string;

  @IsOptional()
  totalQuotas?: string;

  @IsObject()
  @IsNotEmpty()
  inscricoes: {
    estadual: boolean;
    municipal: boolean;
    especial: boolean;
  };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSocioDto)
  socios: CreateSocioDto[];

  @IsObject()
  @IsOptional()
  especificos?: Record<string, any>;

  @IsArray()
  @IsOptional()
  documentos?: Array<{
    id: string | number;
    nome: string;
    tipo: string;
    tamanho: number;
    tipoDocumento: string;
    dataUpload: string;
    dados?: string;
  }>;

  @IsString()
  @IsOptional()
  status?: string;
}
