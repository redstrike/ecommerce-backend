import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './modules/app.controller'
import { AppService } from './modules/app.service'
import { CommonModule } from './common/common.module'
import { RedisModule } from './infra/redis/redis.module'
import { PostgresModule } from './infra/postgres/postgres.module'

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PostgresModule, RedisModule, CommonModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
