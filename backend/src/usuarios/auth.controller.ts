import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { Usuario } from './usuario.entity.js';
import { UsuariosService } from './usuarios.service.js';

// Rotas usadas pelas telas Registrar.tsx e Entrar.tsx do front
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registrar')
  @ApiCreatedResponse({ type: Usuario })
  @ApiConflictResponse({ description: 'E-mail ou gamertag já cadastrados' })
  registrar(@Body() dto: RegistrarDto) {
    return this.usuariosService.registrar(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: Usuario })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha incorretos' })
  login(@Body() dto: LoginDto) {
    return this.usuariosService.login(dto);
  }
}
