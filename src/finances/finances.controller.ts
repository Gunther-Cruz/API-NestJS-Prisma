import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { RequiredModule } from 'src/guards/module.decorator';

@Controller('financeiro')
export class FinancesController {
  constructor(private readonly financeService: FinancesService) {}

  @Get('relatorio')
  @UseGuards(AuthGuard, PermissionGuard) 
  @RequiredModule('FINANCEIRO')
  generateRepoFinances() {
    return this.financeService.findAll();
  }
}