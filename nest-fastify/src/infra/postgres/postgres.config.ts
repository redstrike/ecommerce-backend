import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import type { LoggerOptions, LogLevel } from 'typeorm'
import { User } from '../../modules/users/domain/user.entity'

export const POSTGRES_TOKEN = 'postgres'

export default registerAs(POSTGRES_TOKEN, (): TypeOrmModuleOptions => {
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
	}
})

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
