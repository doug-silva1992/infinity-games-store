import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Conta do jogador: dados do cadastro + perfil gamer exibido na Central do Jogador
@Entity('usuarios')
export class Usuario {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'InfinityRider' })
  @Column({ length: 16, unique: true })
  gamertag: string;

  @ApiProperty({ example: 'voce@exemplo.com' })
  @Column({ unique: true })
  email: string;

  // Fica fora dos selects padrão; o login busca explicitamente com addSelect
  @Column({ name: 'senha_hash', select: false })
  senhaHash: string;

  @ApiProperty({ example: 'Novato' })
  @Column({ length: 60, default: 'Novato' })
  titulo: string;

  @ApiProperty({ example: 0 })
  @Column({ type: 'int', default: 0 })
  xp: number;

  @ApiProperty({ example: 0 })
  @Column({ name: 'horas_jogadas', type: 'int', default: 0 })
  horasJogadas: number;

  @ApiProperty()
  @Column({ name: 'termos_aceitos_em', type: 'timestamptz' })
  termosAceitosEm: Date;

  @ApiProperty()
  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  criadoEm: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamptz' })
  atualizadoEm: Date;
}
