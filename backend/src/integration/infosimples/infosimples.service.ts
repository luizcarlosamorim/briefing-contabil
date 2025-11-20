import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CNPJResponseDto } from './dto/cnpj-response.dto';

@Injectable()
export class InfosimplesService {
  private readonly logger = new Logger(InfosimplesService.name);
  private readonly apiUrl = 'https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj';
  private readonly token: string;

  constructor(private configService: ConfigService) {
    this.token = this.configService.get<string>('INFOSIMPLES_TOKEN');

    if (!this.token) {
      this.logger.warn('⚠️ INFOSIMPLES_TOKEN not configured');
    }
  }

  async consultarCNPJ(cnpj: string): Promise<CNPJResponseDto> {
    // Validar CNPJ
    const cnpjLimpo = this.limparCNPJ(cnpj);

    if (!this.validarCNPJ(cnpjLimpo)) {
      throw new HttpException(
        'CNPJ inválido. Deve conter 14 dígitos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(`🔍 Consultando CNPJ: ${cnpjLimpo}`);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          cnpj: cnpjLimpo,
          timeout: 300,
        }),
      });

      const result = await response.json();

      // Verificar código de resposta
      if (result.code !== 200) {
        const mensagemErro = this.getMensagemErro(result.code);
        this.logger.error(`❌ Erro Infosimples (${result.code}): ${mensagemErro}`);

        throw new HttpException(
          {
            statusCode: this.mapStatusCode(result.code),
            message: mensagemErro,
            code: result.code,
            errors: result.errors || [],
          },
          this.mapStatusCode(result.code),
        );
      }

      // Verificar se retornou dados
      if (!result.data || result.data.length === 0) {
        throw new HttpException(
          'Nenhum dado encontrado para este CNPJ',
          HttpStatus.NOT_FOUND,
        );
      }

      const dadosCNPJ = result.data[0];

      this.logger.log(`✅ CNPJ encontrado: ${dadosCNPJ.razao_social || dadosCNPJ.nome}`);

      // Normalizar dados
      return this.normalizarDados(dadosCNPJ, result);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`❌ Erro ao consultar CNPJ: ${error.message}`);

      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Erro ao conectar com a API Infosimples. Tente novamente mais tarde.',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private normalizarDados(dados: any, result: any): CNPJResponseDto {
    return {
      // Dados básicos
      nome: dados.razao_social || dados.nome,
      fantasia: dados.nome_fantasia,
      cnpj: dados.cnpj,
      situacao: dados.situacao_cadastral,
      data_situacao: dados.data_situacao_cadastral,

      // Endereço
      logradouro: dados.logradouro,
      numero: dados.numero,
      complemento: dados.complemento,
      bairro: dados.bairro,
      municipio: dados.municipio,
      uf: dados.uf,
      cep: dados.cep,

      // Contato
      email: dados.email,
      telefone: dados.telefone_1 || dados.telefone,

      // Atividades
      atividade_principal: dados.atividade_principal,
      atividades_secundarias: dados.atividades_secundarias,

      // Dados societários
      natureza_juridica: dados.natureza_juridica,
      capital_social: dados.capital_social,
      porte: dados.porte,
      qsa: dados.qsa,

      // Datas
      data_abertura: dados.data_abertura,

      // Situação especial
      situacao_especial: dados.situacao_especial,

      // Optantes
      opcao_simples: dados.opcao_simples,
      opcao_mei: dados.opcao_mei,

      // Comprovantes
      comprovantes: result.site_receipts || [],
    };
  }

  private limparCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  private validarCNPJ(cnpj: string): boolean {
    return cnpj.length === 14;
  }

  private getMensagemErro(code: number): string {
    const erros = {
      601: 'Token de autenticação inválido',
      603: 'Token sem autorização para este serviço',
      604: 'CNPJ inválido',
      605: 'Tempo de consulta excedido. Tente novamente.',
      608: 'CNPJ não encontrado na Receita Federal',
      612: 'CNPJ não retornou dados',
      615: 'Receita Federal temporariamente indisponível',
      620: 'Erro permanente na consulta',
    };

    return erros[code] || 'Erro desconhecido ao consultar CNPJ';
  }

  private mapStatusCode(code: number): HttpStatus {
    const mapping = {
      601: HttpStatus.UNAUTHORIZED,
      603: HttpStatus.FORBIDDEN,
      604: HttpStatus.BAD_REQUEST,
      605: HttpStatus.REQUEST_TIMEOUT,
      608: HttpStatus.NOT_FOUND,
      612: HttpStatus.NOT_FOUND,
      615: HttpStatus.SERVICE_UNAVAILABLE,
      620: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    return mapping[code] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
