import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { Pedido } from './pedido.entity.js';
import { PedidosController } from './pedidos.controller.js';
import { PedidosService } from './pedidos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido]), UsuariosModule],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
