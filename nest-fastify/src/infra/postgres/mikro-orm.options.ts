import { Migrator } from '@mikro-orm/migrations'
import { PostgreSqlDriver, ReflectMetadataProvider, type Options } from '@mikro-orm/postgresql'
import { env } from '@redstrike/backend-toolkit'

/**
 * Creates MikroORM configuration options for PostgreSQL.
 * When ConfigService is provided (NestJS runtime), uses it for env vars.
 * When ConfigService is not provided (CLI), falls back to process.env.
 */
export function createMikroOrmOptions(): Options {
	return {
		driver: PostgreSqlDriver,
		host: env('POSTGRES_HOST', 'localhost'),
		port: env('POSTGRES_PORT', 5432),
		user: env<string>('POSTGRES_USER'),
		password: env<string>('POSTGRES_PASSWORD'),
		dbName: env<string>('POSTGRES_DB'),
		entities: ['./dist/**/*.entity.js'],
		entitiesTs: ['./src/**/*.entity.ts'],
		metadataProvider: ReflectMetadataProvider,
		debug: env('MIKRO_ORM_DEBUG', false),
		pool: {
			min: env('POSTGRES_MIN_POOL_SIZE', 1),
			max: env('POSTGRES_POOL_SIZE', 10),
		},
		extensions: [Migrator],
		migrations: {
			tableName: 'mikro_orm_migrations',
			path: './dist/migrations',
			pathTs: './src/migrations',
			emit: 'ts',
		},
	}
}
