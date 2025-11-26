import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import postgresConfig, { POSTGRES_TOKEN } from './postgres.config'
import { PostgresService } from './postgres.service'

@Module({
	imports: [
		ConfigModule.forFeature(postgresConfig),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => configService.getOrThrow(POSTGRES_TOKEN),
			inject: [ConfigService],
		}),
	],
	providers: [PostgresService],
	exports: [TypeOrmModule, PostgresService],
})
export class PostgresModule {}
