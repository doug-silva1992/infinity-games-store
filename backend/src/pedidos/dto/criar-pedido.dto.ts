import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { METODOS, type Metodo } from '../pedido.entity.js';

export class ItemPedidoDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  jogoId: number;

  @ApiProperty({ example: 'Lâmina Eterna' })
  @IsString()
  @MaxLength(80)
  titulo: string;

  @ApiProperty({ example: 149.9 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco: number;
}

// Enviado pelo Checkout.tsx quando o pagamento é concluído
export class CriarPedidoDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ example: '482913' })
  @Matches(/^\d{6}$/, { message: 'Número do pedido inválido.' })
  numero: string;

  @ApiProperty({ enum: METODOS })
  @IsIn(METODOS, { message: 'Forma de pagamento inválida.' })
  metodo: Metodo;

  @ApiProperty({ type: [ItemPedidoDto] })
  @IsArray()
  @ArrayNotEmpty({ message: 'O pedido precisa ter ao menos um jogo.' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}
