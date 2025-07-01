import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.seedModules();
  }

  //criar modulos
  async seedModules() {
    console.log('A verificar e a criar módulos fixos...');
    const moduleNames = ['FINANCEIRO', 'RELATORIOS', 'PRODUTOS', 'USUARIOS', 'PERFIL'];
    
    for (const name of moduleNames) {
      const moduleExists = await this.module.findUnique({ where: { name } });
      if (!moduleExists) {
        await this.module.create({ data: { name } });
        console.log(`Módulo '${name}' criado.`);
      }
    }
    console.log('Verificação de módulos concluída.');
  }
}