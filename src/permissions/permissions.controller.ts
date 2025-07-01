import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RequiredModule } from 'src/guards/module.decorator';
import { PermissionGuard } from 'src/guards/permission.guard';
import { GrantPermissionDto } from './dto/grant-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('grant')
  @UseGuards(AuthGuard, PermissionGuard)
  @RequiredModule('USUARIOS') //quem tem essa permissao, pode conceder permissões, e acessar o módulo USUARIOS em users.controller.ts
  grant(@Body() grantPermissionDto: GrantPermissionDto) {
    return this.permissionsService.grant(grantPermissionDto);
  }
}