import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CriarPedidoDto } from './dto/criar-pedido.dto.js';
import { Pedido } from './pedido.entity.js';
import { PedidosService } from './pedidos.service.js';

// Rotas usadas pelo Checkout.tsx (criar) e pela tela Minha conta (listar)
@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiCreatedResponse({ type: Pedido })
  criar(@Body() dto: CriarPedidoDto) {
    return this.pedidosService.criar(dto);
  }

  @Get('usuario/:usuarioId')
  @ApiOkResponse({ type: [Pedido] })
  listarDoUsuario(@Param('usuarioId', ParseUUIDPipe) usuarioId: string) {
    return this.pedidosService.listarDoUsuario(usuarioId);
  }
}
