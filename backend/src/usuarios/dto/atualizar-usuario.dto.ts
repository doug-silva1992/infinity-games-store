import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { GAMERTAG_REGEX } from './registrar.dto.js';

// Campos do perfil que podem ser alterados depois do cadastro
export class AtualizarUsuarioDto {
  @ApiPropertyOptional({ example: 'InfinityRider' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(GAMERTAG_REGEX, {
    message: 'De 3 a 16 caracteres: letras, números ou _.',
  })
  gamertag?: string;

  @ApiPropertyOptional({ example: 'Domador de Dragões' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  titulo?: string;

  @ApiPropertyOptional({ example: 1284 })
  @IsOptional()
  @IsInt()
  @Min(0)
  horasJogadas?: number;
}

export class GanharXpDto {
  @ApiProperty({ example: 250 })
  @IsInt()
  @Min(1)
  quantidade: number;
}
