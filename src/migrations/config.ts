import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { migrations } from './index';

config({ path: '.env' });

export const schema = process.env.DATABASE_SCHEMA || 'public';

export default new DataSource({
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DB,
  port: 5432,
  host: 'localhost',
  schema: process.env.DATABASE_SCHEMA,
  entities: ['./**/*.entity.ts'],
  migrations: migrations,
  migrationsTableName: `migrations`,
});
