import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { BriefingsService } from './briefings.service';
import { CreateBriefingDto } from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';
import { FilterBriefingDto } from './dto/filter-briefing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExportService } from './export.service';

@Controller('briefings')
export class BriefingsController {
  constructor(
    private readonly briefingsService: BriefingsService,
    private readonly exportService: ExportService,
  ) {}

  @Post()
  create(@Body() createBriefingDto: CreateBriefingDto, @Request() req?) {
    const userId = req?.user?.id;
    return this.briefingsService.create(createBriefingDto, userId);
  }

  @Get()
  findAll(@Query() filters: FilterBriefingDto) {
    return this.briefingsService.findAll(filters);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  getStatistics() {
    return this.briefingsService.getStatistics();
  }

  @Get('export/excel')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="briefings.xlsx"')
  async exportExcel(@Query() filters: FilterBriefingDto): Promise<StreamableFile> {
    const { data } = await this.briefingsService.findAll(filters);
    const buffer = await this.exportService.exportToExcel(data);
    return new StreamableFile(buffer);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="briefings.csv"')
  async exportCSV(@Query() filters: FilterBriefingDto): Promise<StreamableFile> {
    const { data } = await this.briefingsService.findAll(filters);
    const buffer = await this.exportService.exportToCSV(data);
    return new StreamableFile(Buffer.from(buffer));
  }

  @Get('protocolo/:numero')
  findByProtocolo(@Param('numero') numero: string) {
    return this.briefingsService.findByProtocolo(numero);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.briefingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBriefingDto: UpdateBriefingDto) {
    return this.briefingsService.update(id, updateBriefingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.briefingsService.remove(id);
  }
}
