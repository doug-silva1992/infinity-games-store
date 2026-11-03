import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { CriarPedidoDto } from './dto/criar-pedido.dto.js';
import { Pedido } from './pedido.entity.js';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidos: Repository<Pedido>,
    private readonly usuariosService: UsuariosService,
  ) {}

  async criar(dto: CriarPedidoDto): Promise<Pedido> {
    await this.usuariosService.buscarPorId(dto.usuarioId);
    const centavos = dto.itens.reduce(
      (s, i) => s + Math.round(i.preco * 100),
      0,
    );
    const pago = dto.metodo !== 'boleto';
    return this.pedidos.save(
      this.pedidos.create({
        numero: dto.numero,
        usuarioId: dto.usuarioId,
        itens: dto.itens,
        total: centavos / 100,
        metodo: dto.metodo,
        status: pago ? 'pago' : 'pendente',
        pagoEm: pago ? new Date() : null,
      }),
    );
  }

  listarDoUsuario(usuarioId: string): Promise<Pedido[]> {
    return this.pedidos.find({
      where: { usuarioId },
      order: { criadoEm: 'DESC' },
    });
  }
}
