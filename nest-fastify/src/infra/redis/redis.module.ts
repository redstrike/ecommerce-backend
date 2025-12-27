import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import redisConfig from './redis.config'
import { redisProvider } from './redis.provider'
import { RedisService } from './redis.service'

@Global()
@Module({
	imports: [ConfigModule.forFeature(redisConfig)],
	providers: [RedisService, redisProvider],
	exports: [RedisService, redisProvider],
})
export class RedisModule {}
