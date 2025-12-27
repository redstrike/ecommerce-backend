import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'
import { REDIS_TOKEN } from './redis.config'

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
	private client: RedisClientType
	private readonly logger = new Logger(RedisService.name)

	constructor(private configService: ConfigService) {}

	async onModuleInit() {
		const host = this.configService.get<string>(`${REDIS_TOKEN}.host`)
		const port = this.configService.get<number>(`${REDIS_TOKEN}.port`)
		const password = this.configService.get<string>(`${REDIS_TOKEN}.password`)
		this.client = createClient({ url: `redis://${host}:${port}`, password })

		this.client.on('error', (err) => this.logger.error('Redis Client Error', err))

		try {
			await this.client.connect()
			this.logger.log('Redis connected successfully.')
		} catch (error) {
			this.logger.error('Failed to connect to Redis.', error)
			process.exit(1)
		}
	}

	async onApplicationShutdown() {
		if (this.client) {
			await this.client.close()
			this.logger.log('Redis connection closed.')
		}
	}

	getClient(): RedisClientType {
		return this.client
	}
}
