import { FactoryProvider } from '@nestjs/common'
import { RedisClientType } from 'redis'
import { RedisService } from './redis.service'

export const REDIS_CLIENT = 'REDIS_CLIENT'

export const redisProvider: FactoryProvider<RedisClientType> = {
	provide: REDIS_CLIENT,
	useFactory: (redisService: RedisService) => redisService.getClient(),
	inject: [RedisService],
}
