import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import redisConfig from './redis.config' // Updated import path
import { redisProvider } from './redis.provider'

@Global()
@Module({
	imports: [ConfigModule.forFeature(redisConfig)],
	providers: [redisProvider],
	exports: [redisProvider],
})
export class RedisModule {}
