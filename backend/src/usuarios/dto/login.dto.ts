import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { SENHA_MINIMA } from './registrar.dto.js';

export class LoginDto {
  @ApiProperty({ example: 'voce@exemplo.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ example: 'segredo123' })
  @IsString()
  @MinLength(SENHA_MINIMA, {
    message: `A senha tem pelo menos ${SENHA_MINIMA} caracteres.`,
  })
  senha: string;
}
