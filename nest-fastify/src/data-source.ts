// src/data-source.ts
// This DataSource is used by the TypeORM CLI for migrations.
// It must be kept in sync with the TypeORM configuration in your NestJS modules.
import { DataSource } from 'typeorm'
import { config } from 'dotenv'

config()

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: ['src/**/*.entity.ts'],
	migrations: ['src/migrations/*.ts'],
	synchronize: false, // Always false for migrations
	logging:
		(process.env.TYPEORM_LOG_LEVELS?.split(',') as ('query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration')[]) || true,
})
