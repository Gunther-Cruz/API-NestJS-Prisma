import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma.service';
import { MODULE_KEY } from './module.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.get<string>(
      'module', 
      context.getHandler(),
    );

    if (!requiredModule) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; //payload fornecido pelo AuthGuard

    //usuario ta autenticado?
    if (!user || !user.sub) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    let hasPermission = false;

   //user é superuser ou admin?
    if (user.role === UserRole.SUPERUSER || user.role === UserRole.ADMIN) {
      hasPermission = true;
    } 
    
    //user esta acessando o perfil dele?
    else if (requiredModule === 'PERFIL') {
      hasPermission = true;
    }
    
    //se nao, verifica a permissao no banco de dados
    else {
      const permission = await this.prisma.permission.findFirst({
        where: {
          userId: user.sub, // O ID do usuário que vem do token
          module: {
            name: requiredModule,
          },
        },
      });
      
      //permitido? true
      if (permission) {
        hasPermission = true;
      }
    }

    //registra o acesso no log, mesmo que tenha sido negado
    await this.prisma.accessLog.create({
      data: {
        userId: user.sub,
        route: request.url,
        granted: hasPermission,
      },
    });

    if (hasPermission) {
      return true;
    }

    throw new ForbiddenException(
      `SEM PERMISSÃO PARA ACESSAR O MÓDULO ${requiredModule}`,
    );
  }
}

