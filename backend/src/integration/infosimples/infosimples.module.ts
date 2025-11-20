import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfosimplesService } from './infosimples.service';
import { InfosimplesController } from './infosimples.controller';

@Module({
  imports: [ConfigModule],
  controllers: [InfosimplesController],
  providers: [InfosimplesService],
  exports: [InfosimplesService],
})
export class InfosimplesModule {}
