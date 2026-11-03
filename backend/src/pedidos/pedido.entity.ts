import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity.js';

export const METODOS = ['cartao', 'pix', 'boleto'] as const;
export type Metodo = (typeof METODOS)[number];
export type StatusPedido = 'pago' | 'pendente';

// Jogo do catálogo do front com o preço congelado no momento da compra
export class ItemPedido {
  @ApiProperty({ example: 2 })
  jogoId: number;

  @ApiProperty({ example: 'Lâmina Eterna' })
  titulo: string;

  @ApiProperty({ example: 149.9 })
  preco: number;
}

// numeric chega do Postgres como string
const decimal = {
  to: (v: number) => v,
  from: (v: string) => Number(v),
};

@Entity('pedidos')
export class Pedido {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '482913' })
  @Column({ length: 12 })
  numero: string;

  @ApiProperty({ format: 'uuid' })
  @Index()
  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario?: Usuario;

  @ApiProperty({ type: [ItemPedido] })
  @Column({ type: 'jsonb' })
  itens: ItemPedido[];

  @ApiProperty({ example: 149.9 })
  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: decimal })
  total: number;

  @ApiProperty({ enum: METODOS })
  @Column({ length: 10 })
  metodo: Metodo;

  // Cartão e Pix são aprovados na hora; boleto fica pendente até a compensação
  @ApiProperty({ enum: ['pago', 'pendente'] })
  @Column({ length: 10 })
  status: StatusPedido;

  @ApiProperty({ nullable: true })
  @Column({ name: 'pago_em', type: 'timestamptz', nullable: true })
  pagoEm: Date | null;

  @ApiProperty()
  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  criadoEm: Date;
}
