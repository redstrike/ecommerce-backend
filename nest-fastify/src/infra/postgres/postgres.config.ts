import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import type { DataSourceOptions } from 'typeorm'
import type { PoolConfig } from 'pg'
import type { LoggerOptions, LogLevel } from 'typeorm'
import { User } from '../../modules/users/domain/user.entity'

export const POSTGRES_TOKEN = 'postgres'

/**
 * Shared TypeORM configuration factory.
 * This function is used by both:
 * 1. NestJS modules (via registerAs)
 * 2. TypeORM CLI DataSource (via createTypeOrmConfig)
 * 
 * This ensures configuration consistency across all contexts.
 */
export function createTypeOrmConfig(): TypeOrmModuleOptions & DataSourceOptions {
	return {
		type: 'postgres',
		host: process.env.POSTGRES_HOST || 'localhost',
		port: Number(process.env.POSTGRES_PORT) || 5432,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
		logging: parseLogLevels(process.env.TYPEORM_LOG_LEVELS),
		entities: [User],
		// For CLI: use glob patterns to load entities
		// For NestJS: the array above works fine
		...(process.env.TYPEORM_CLI === 'true' && {
			entities: ['src/**/*.entity.ts'],
			migrations: ['src/migrations/*.ts'],
		}),
		poolSize: Number(process.env.POSTGRES_POOL_SIZE) || 10,
		extra: {
			min: Number(process.env.POSTGRES_MIN_POOL_SIZE) || 1,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		} as PoolConfig,
	}
}

/**
 * NestJS configuration provider.
 * Uses the shared factory to ensure consistency.
 */
export default registerAs(POSTGRES_TOKEN, createTypeOrmConfig)

function parseLogLevels(value?: string): LoggerOptions {
	if (value === 'false') {
		return false
	}
	if (value === 'true') {
		return true
	}
	if (value === 'all') {
		return 'all'
	}
	if (value) {
		return value.split(',').map((level) => level.trim() as LogLevel)
	}
	return [] // Default to no logging if not specified
}
