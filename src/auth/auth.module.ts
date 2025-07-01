import { Module , forwardRef  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from "@nestjs/jwt";

import { PrismaService } from "src/prisma.service";
import { UsersService } from "src/users/users.service";
import { PermissionGuard } from 'src/guards/permission.guard'; 

export const jwtConstants = {
  secret: 'MINHA_CHAVE_SECRETA_SUPER_DIFICIL_DE_ADIVINHAR_12345',
};

@Module({
  imports: [
    JwtModule.register({secret: jwtConstants.secret, signOptions: { expiresIn: '1h' }}),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UsersService, PermissionGuard],//AuthGuard
  exports: [AuthService, PermissionGuard],
})
export class AuthModule {}
