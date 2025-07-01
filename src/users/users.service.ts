import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ConflictException, ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@prisma/client'; // Importe o tipo User
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) { }

  //cria um superuser se não existir
  async onModuleInit() {
    const superuserExists = await this.prisma.user.findFirst({
      where: { role: 'SUPERUSER' },
    });

    if (!superuserExists) {
      console.log('Nenhum Superusuário encontrado. Criando um novo...');
      const hashedPassword = await bcrypt.hash('super-secret-password', 10); 
      await this.prisma.user.create({
        data: {
          email: 'superuser@domain.com',
          name: 'Super User',
          password: hashedPassword,
          role: UserRole.SUPERUSER,
        },
      });
      console.log('Superusuário criado com sucesso.');
    }
  }

  async create(createUserDto: CreateUserDto, creator: User) {
    
    // verifica existencia do email
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new ConflictException('Esse email já está em uso.');
    }

    let finalRole: UserRole = UserRole.USER;

    if (creator.role === UserRole.SUPERUSER) {
      finalRole = createUserDto.role || UserRole.USER
      if (finalRole === UserRole.SUPERUSER) {
        throw new ForbiddenException('Não é permitido criar outro Superusuário.');
      }
    } else if (creator.role === UserRole.ADMIN) {
      finalRole = UserRole.USER;//ele nao consegue criar admins ou superuser
    } else {
      throw new ForbiddenException('Usuários normais não podem criar novos usuários.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        jobTitle: createUserDto.jobTitle,
        role: finalRole,
      },
    });

    const { password, ...result } = createdUser;//retira senha do usuario criado
    return result;
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }


  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        jobTitle: true,
        role: true,
      },
    });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        jobTitle: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto, updater: { role: UserRole }) {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });

    if (!userToUpdate) {
      throw new NotFoundException('Usuário a ser atualizado não encontrado.');
    }

    if (userToUpdate.role === 'SUPERUSER' && updater.role !== 'SUPERUSER') {
      throw new ForbiddenException('Administradores não podem editar Superusuários.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateProfileDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        jobTitle: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  }

  async remove(id: string) {
    const userToDelete = await this.prisma.user.findUnique({ where: { id } });

    if (!userToDelete) {
      throw new NotFoundException('Usuário a ser deletado não encontrado.');
    }

    //ninguem pode deletar um Superusuário.
    if (userToDelete.role === 'SUPERUSER') {
      throw new ForbiddenException('O Superusuário não pode ser deletado.');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

}
