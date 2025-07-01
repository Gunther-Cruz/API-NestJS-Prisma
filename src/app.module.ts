import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module'; 
import { AuthModule } from './auth/auth.module';
import { FinancesModule } from './finances/finances.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProfileModule } from './profile/profile.module';
import { ReportsModule } from './reports/reports.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [UsersModule, PrismaModule, AuthModule, FinancesModule, PermissionsModule, ProfileModule, ReportsModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
