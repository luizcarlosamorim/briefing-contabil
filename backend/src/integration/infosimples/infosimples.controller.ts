import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { InfosimplesService } from './infosimples.service';
import { CNPJResponseDto } from './dto/cnpj-response.dto';

@Controller('cnpj')
export class InfosimplesController {
  constructor(private readonly infosimplesService: InfosimplesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async consultarCNPJ(@Query('cnpj') cnpj: string): Promise<CNPJResponseDto> {
    if (!cnpj) {
      throw new Error('CNPJ é obrigatório');
    }

    return this.infosimplesService.consultarCNPJ(cnpj);
  }
}
