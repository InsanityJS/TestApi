import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { migrations } from './migrations';
import { config } from 'dotenv';

config({ path: '.env' });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      entities: ['./**/*.entity.ts'],
      synchronize: false,
      autoLoadEntities: true,
      logging: true,
      ssl: false,
      migrations: migrations,
      migrationsTableName: `migrations`,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
