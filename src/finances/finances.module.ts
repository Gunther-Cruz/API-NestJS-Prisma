import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  controllers: [FinancesController],
  providers: [FinancesService, JwtService, AuthGuard],
})
export class FinancesModule {}
