import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  AtualizarUsuarioDto,
  GanharXpDto,
} from './dto/atualizar-usuario.dto.js';
import { Usuario } from './usuario.entity.js';
import { UsuariosService } from './usuarios.service.js';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOkResponse({ type: [Usuario] })
  listar() {
    return this.usuariosService.listar();
  }

  @Get('ranking')
  @ApiQuery({ name: 'limite', required: false, example: 10 })
  @ApiOkResponse({ type: [Usuario] })
  ranking(@Query('limite') limite?: string) {
    const n = Math.min(Math.max(Number(limite) || 10, 1), 100);
    return this.usuariosService.ranking(n);
  }

  @Get('gamertag/:gamertag')
  @ApiOkResponse({ type: Usuario })
  buscarPorGamertag(@Param('gamertag') gamertag: string) {
    return this.usuariosService.buscarPorGamertag(gamertag);
  }

  @Get(':id')
  @ApiOkResponse({ type: Usuario })
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Usuario })
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarUsuarioDto,
  ) {
    return this.usuariosService.atualizar(id, dto);
  }

  @Post(':id/xp')
  @HttpCode(200)
  @ApiOkResponse({ type: Usuario })
  ganharXp(@Param('id', ParseUUIDPipe) id: string, @Body() dto: GanharXpDto) {
    return this.usuariosService.ganharXp(id, dto.quantidade);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.remover(id);
  }
}
