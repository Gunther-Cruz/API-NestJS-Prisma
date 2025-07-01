import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto'; 


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: AuthDto) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return this.authService.login(user);
  }

  
}
