import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard'; 
import { PermissionGuard } from 'src/guards/permission.guard';
import { RequiredModule } from 'src/guards/module.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  //rota para CRIAR usuários
  @Post()
  @UseGuards(AuthGuard, PermissionGuard) 
  @RequiredModule('USUARIOS')
  create(@Body() createUserDto: CreateUserDto, @Request() req) {

    const creator = req.user;

    console.log('DENTRO DO CONTROLLER - usuario criardor:', creator);

    return this.usersService.create(createUserDto, creator);
  }

  //rota para VER todos os usuários
  @Get()
  @UseGuards(AuthGuard, PermissionGuard) 
  @RequiredModule('USUARIOS') 
  findAll() {
    return this.usersService.findAll();
  }

  //rota para VER um usuário específico pelo ID
  @Get(':id')
  @UseGuards(AuthGuard, PermissionGuard)
  @RequiredModule('USUARIOS') 
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  //rota para ALTERAR o perfil do usuário autenticado
  @Patch(':id')
  @UseGuards(AuthGuard, PermissionGuard)
  @RequiredModule('USUARIOS')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  //rota para REMOVER um usuário pelo ID
  @Delete(':id')
  @UseGuards(AuthGuard, PermissionGuard)
  @RequiredModule('USUARIOS')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
