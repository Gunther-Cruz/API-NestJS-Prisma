import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { RequiredModule } from 'src/guards/module.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionGuard) 
  @RequiredModule('RELATORIOS')
  generateReport() {
    return this.reportsService.findAll();
  }
}
