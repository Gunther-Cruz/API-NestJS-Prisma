import { IsNotEmpty, IsString } from 'class-validator';

export class GrantPermissionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  moduleName: string;
}