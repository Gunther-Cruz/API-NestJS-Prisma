import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, JwtService]
})
export class PermissionsModule {}
