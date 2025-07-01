import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto'; // Criaremos este DTO

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },

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

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {

    await this.findOne(userId);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
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
}