import { Injectable, NotFoundException } from '@nestjs/common';
import { GrantPermissionDto } from './dto/grant-permission.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async grant(grantPermissionDto: GrantPermissionDto) {
    const { userId, moduleName } = grantPermissionDto;

    //modulo existe
    const module = await this.prisma.module.findUnique({
      where: { name: moduleName },
    });
    if (!module) {
      throw new NotFoundException(`Módulo com o nome '${moduleName}' não encontrado.`);
    }

    // user existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID '${userId}' não encontrado.`);
    }

    const permission = await this.prisma.permission.upsert({//upsert pode atualizar, assim user nao recebe permissão duplicada
      where: {
        userId_moduleId: {
          userId: userId,
          moduleId: module.id,
        },
      },
      update: {},
      create: {
        userId: userId,
        moduleId: module.id,
      },
    });

    return {
      message: `Permissão para o módulo '${moduleName}' concedida ao usuário '${user.name}'.`,
      permission,
    };
  }

  
}

