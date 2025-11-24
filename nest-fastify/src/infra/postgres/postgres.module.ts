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
			useFactory: (configService: ConfigService) => ({
				...configService.get(POSTGRES_TOKEN),
				entities: [],
			}),
			inject: [ConfigService],
		}),
	],
	providers: [PostgresService],
	exports: [TypeOrmModule, PostgresService],
})
export class PostgresModule {}
