import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/auth/auth.module'; 

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    console.log("Validando Token:", token);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request['user'] = payload;

    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    //autenticado
    return true;
  }

  //extrair o token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

//resumo: AuthGuard é um guardião de autenticação que verifica se o token JWT está presente e é válido. Se o token for válido, ele extrai as informações do usuário do payload e as adiciona ao objeto de solicitação. Se o token não estiver presente ou for inválido, lança uma exceção UnauthorizedException.
// Ele usa o JwtService do NestJS para verificar o token com uma chave secreta definida em jwtConstants. O token é esperado no cabeçalho Authorization no formato "Bearer <