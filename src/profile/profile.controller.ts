import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { RequiredModule } from 'src/guards/module.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //rota para CHEGAR no perfil do usuário autenticado 
  @Get('me')
  @UseGuards(AuthGuard, PermissionGuard)
  @RequiredModule('PERFIL') 
  findMyProfile(@Request() req) {
    const userId = req.user.sub;
    return this.profileService.findOne(userId);
  }

  //rota para ALTERAR o perfil PROPRIO
  @Patch('me')
  @UseGuards(AuthGuard, PermissionGuard)
  @RequiredModule('PERFIL')
  updateMyProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.sub;
    return this.profileService.update(userId, updateProfileDto);
  }
}
