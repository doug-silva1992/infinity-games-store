import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

// Conexão usada só pela CLI de migrations (npm run migration:*).
// Mesmas variáveis do app.module.ts; o que já está no ambiente (ex.: Docker) tem prioridade
for (const arquivo of ['.env', '../.env']) {
  if (existsSync(arquivo)) process.loadEnvFile(arquivo);
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  database: process.env.POSTGRES_DB ?? 'infinity_games',
  migrations: [join(import.meta.dirname, 'migrations', '*.js')],
});
