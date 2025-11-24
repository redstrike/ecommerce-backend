import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class PostgresService implements OnModuleInit {
	private readonly logger = new Logger(PostgresService.name)

	constructor(private dataSource: DataSource) {}

	onModuleInit() {
		if (this.dataSource.isInitialized) {
			this.logger.log('Postgres connected successfully.')
		} else {
			this.logger.error('Failed to connect to Postgres.')
			process.exit(1)
		}
	}
}
