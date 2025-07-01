import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt'; 
import { PrismaService } from 'src/prisma.service';




@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, PrismaService ],
  exports: [UsersService],
})
export class UsersModule {}
