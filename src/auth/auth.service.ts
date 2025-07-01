import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    try {
      if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    catch (error) {
      console.error('Erro ao validar usuário:', error);
      throw new UnauthorizedException('Erro ao validar usuário');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {access_token: this.jwtService.sign(payload)};
  }

}
