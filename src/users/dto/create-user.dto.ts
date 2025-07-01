import { UserRole, JobTitle } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsEnum(JobTitle)
  @IsOptional() 
  jobTitle?: JobTitle;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}