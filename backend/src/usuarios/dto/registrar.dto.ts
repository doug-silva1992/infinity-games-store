import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  Matches,
  MinLength,
} from 'class-validator';

// Mesmas regras da tela de registro do front (Registrar.tsx)
export const SENHA_MINIMA = 6;
export const GAMERTAG_REGEX = /^[a-zA-Z0-9_]{3,16}$/;

export class RegistrarDto {
  @ApiProperty({ example: 'InfinityRider', pattern: GAMERTAG_REGEX.source })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(GAMERTAG_REGEX, {
    message: 'De 3 a 16 caracteres: letras, números ou _.',
  })
  gamertag: string;

  @ApiProperty({ example: 'voce@exemplo.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ minLength: SENHA_MINIMA, example: 'segredo123' })
  @MinLength(SENHA_MINIMA, {
    message: `Use pelo menos ${SENHA_MINIMA} caracteres.`,
  })
  senha: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Equals(true, { message: 'Aceite os termos para criar a conta.' })
  termos: boolean;
}
