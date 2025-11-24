import { FactoryProvider, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'

export const REDIS_CLIENT = 'REDIS_CLIENT'

export const redisProvider: FactoryProvider<Promise<RedisClientType>> = {
	provide: REDIS_CLIENT,
	useFactory: async (configService: ConfigService) => {
		const host = configService.get<string>('redis.host')
		const port = configService.get<number>('redis.port')
		const password = configService.get<string>('redis.password')
		const client = createClient({ url: `redis://${host}:${port}`, password })

		const logger = new Logger('RedisModule')

		client.on('error', logger.error)

		try {
			await client.connect()
			logger.log('Redis connected successfully.')
		} catch (error) {
			logger.error('Failed to connect to Redis.', error)
			process.exit(1)
		}

		return client as RedisClientType
	},
	inject: [ConfigService],
}
