import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlterarEmailDto, AlterarSenhaDto } from './dto/alterar-conta.dto.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { conferirSenha, gerarHashSenha } from './senha.js';
import { Usuario } from './usuario.entity.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
  ) {}

  async registrar(dto: RegistrarDto): Promise<Usuario> {
    await this.garantirDisponivel(dto.gamertag, dto.email);
    const usuario = this.usuarios.create({
      gamertag: dto.gamertag,
      email: dto.email,
      senhaHash: await gerarHashSenha(dto.senha),
      termosAceitosEm: new Date(),
    });
    const { id } = await this.usuarios.save(usuario);
    return this.buscarPorId(id);
  }

  async login(dto: LoginDto): Promise<Usuario> {
    const usuario = await this.usuarios
      .createQueryBuilder('u')
      .addSelect('u.senhaHash')
      .where('u.email = :email', { email: dto.email })
      .getOne();
    // Mesma mensagem para e-mail inexistente e senha errada
    if (!usuario || !(await conferirSenha(dto.senha, usuario.senhaHash))) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }
    const { senhaHash: _, ...semSenha } = usuario;
    return semSenha as Usuario;
  }

  listar(): Promise<Usuario[]> {
    return this.usuarios.find({ order: { criadoEm: 'DESC' } });
  }

  // Ranking da comunidade na Central do Jogador
  ranking(limite = 10): Promise<Usuario[]> {
    return this.usuarios.find({ order: { xp: 'DESC' }, take: limite });
  }

  async buscarPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuarios.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  async buscarPorGamertag(gamertag: string): Promise<Usuario> {
    const usuario = await this.usuarios
      .createQueryBuilder('u')
      .where('LOWER(u.gamertag) = LOWER(:gamertag)', { gamertag })
      .getOne();
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  async atualizar(id: string, dto: AtualizarUsuarioDto): Promise<Usuario> {
    const usuario = await this.buscarPorId(id);
    if (
      dto.gamertag &&
      dto.gamertag.toLowerCase() !== usuario.gamertag.toLowerCase()
    ) {
      await this.garantirDisponivel(dto.gamertag);
    }
    await this.usuarios.update(id, dto);
    return this.buscarPorId(id);
  }

  async alterarEmail(id: string, dto: AlterarEmailDto): Promise<Usuario> {
    await this.conferirSenhaAtual(id, dto.senhaAtual);
    const existente = await this.usuarios.findOneBy({ email: dto.email });
    if (existente && existente.id !== id) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }
    await this.usuarios.update(id, { email: dto.email });
    return this.buscarPorId(id);
  }

  async alterarSenha(id: string, dto: AlterarSenhaDto): Promise<void> {
    await this.conferirSenhaAtual(id, dto.senhaAtual);
    await this.usuarios.update(id, {
      senhaHash: await gerarHashSenha(dto.novaSenha),
    });
  }

  // Soma XP de forma atômica (ex.: após uma compra no checkout)
  async ganharXp(id: string, quantidade: number): Promise<Usuario> {
    const { affected } = await this.usuarios.increment(
      { id },
      'xp',
      quantidade,
    );
    if (!affected) throw new NotFoundException('Usuário não encontrado.');
    return this.buscarPorId(id);
  }

  async remover(id: string): Promise<void> {
    const { affected } = await this.usuarios.delete(id);
    if (!affected) throw new NotFoundException('Usuário não encontrado.');
  }

  private async conferirSenhaAtual(id: string, senha: string) {
    const usuario = await this.usuarios
      .createQueryBuilder('u')
      .addSelect('u.senhaHash')
      .where('u.id = :id', { id })
      .getOne();
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    if (!(await conferirSenha(senha, usuario.senhaHash))) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }
  }

  // Gamertag é única sem diferenciar maiúsculas; e-mail já chega em minúsculas
  private async garantirDisponivel(gamertag: string, email?: string) {
    const qb = this.usuarios
      .createQueryBuilder('u')
      .select(['u.gamertag', 'u.email'])
      .where('LOWER(u.gamertag) = LOWER(:gamertag)', { gamertag });
    if (email) qb.orWhere('u.email = :email', { email });
    const existente = await qb.getOne();
    if (!existente) return;
    if (email && existente.email === email) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }
    throw new ConflictException('Esta gamertag já está em uso.');
  }
}
