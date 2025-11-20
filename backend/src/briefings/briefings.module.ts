import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BriefingsService } from './briefings.service';
import { BriefingsController } from './briefings.controller';
import { ExportService } from './export.service';
import { Briefing } from './briefing.entity';
import { Socio } from './socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Briefing, Socio])],
  providers: [BriefingsService, ExportService],
  controllers: [BriefingsController],
  exports: [BriefingsService],
})
export class BriefingsModule {}
