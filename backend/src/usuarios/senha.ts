import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  senha: string,
  salt: string,
  tamanho: number,
) => Promise<Buffer>;

const TAMANHO_CHAVE = 64;

// Formato salvo no banco: "<salt>:<hash>" em hexadecimal
export async function gerarHashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(senha, salt, TAMANHO_CHAVE);
  return `${salt}:${hash.toString('hex')}`;
}

export async function conferirSenha(
  senha: string,
  salvo: string,
): Promise<boolean> {
  const [salt, hashHex] = salvo.split(':');
  if (!salt || !hashHex) return false;
  const esperado = Buffer.from(hashHex, 'hex');
  const hash = await scryptAsync(senha, salt, esperado.length);
  return timingSafeEqual(hash, esperado);
}
