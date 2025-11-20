import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BriefingsModule } from './briefings/briefings.module';
import { InfosimplesModule } from './integration/infosimples/infosimples.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    UsersModule,
    BriefingsModule,
    InfosimplesModule,  // 🆕 Módulo de integração CNPJ
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
