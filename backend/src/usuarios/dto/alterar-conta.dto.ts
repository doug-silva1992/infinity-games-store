import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { SENHA_MINIMA } from './registrar.dto.js';

// Trocas sensíveis da tela Minha conta: sempre pedem a senha atual
export class AlterarEmailDto {
  @ApiProperty({ example: 'novo@exemplo.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ example: 'segredo123' })
  @IsString()
  @MinLength(1, { message: 'Informe sua senha atual.' })
  senhaAtual: string;
}

export class AlterarSenhaDto {
  @ApiProperty({ example: 'segredo123' })
  @IsString()
  @MinLength(1, { message: 'Informe sua senha atual.' })
  senhaAtual: string;

  @ApiProperty({ minLength: SENHA_MINIMA, example: 'novaSenha456' })
  @IsString()
  @MinLength(SENHA_MINIMA, {
    message: `Use pelo menos ${SENHA_MINIMA} caracteres.`,
  })
  novaSenha: string;
}
