import { MikroORM } from '@mikro-orm/core'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PostgresService implements OnModuleInit {
	private readonly logger = new Logger(PostgresService.name)

	constructor(private readonly orm: MikroORM) {}

	async onModuleInit() {
		const isConnected = await this.orm.isConnected()
		if (isConnected) {
			this.logger.log('Postgres connected successfully.')
		} else {
			this.logger.error('Failed to connect to Postgres.')
			process.exit(1)
		}
	}
}
