import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CommonModule } from './common/common.module'
import { PostgresModule } from './infra/postgres/postgres.module'
import { RedisModule } from './infra/redis/redis.module'
import { AppController } from './modules/app.controller'
import { AppService } from './modules/app.service'
import { UsersModule } from './modules/users/users.module'

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PostgresModule, RedisModule, CommonModule, UsersModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
