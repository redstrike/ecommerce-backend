import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createMikroOrmOptions } from './mikro-orm.options';
import { PostgresService } from './postgres.service';

@Module({
	imports: [
		MikroOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [],
			useFactory: () => createMikroOrmOptions(),
		}),
	],
	providers: [PostgresService],
	exports: [PostgresService],
})
export class PostgresModule {}
