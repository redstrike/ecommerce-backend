import { type INestApplication, LOG_LEVELS, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'

describe('AppController (e2e)', () => {
	let app: INestApplication<App>

	beforeAll(async () => {
		const isTestEnv = process.env.NODE_ENV === 'test'

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication({
			// 2025-12-27: Exclude nest's error logging to avoid polluting test output
			logger: isTestEnv ? ['debug', 'log', 'warn', 'fatal'] : LOG_LEVELS,
		})

		// Enable validation globally (same as production)
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		)

		app.enableShutdownHooks()

		await app.init()
	})

	afterAll(async () => {
		await app.close()
	})

	it('/ (GET)', () => {
		return request(app.getHttpServer()).get('/').expect(200).expect('{"success":true,"message":"Hello world!"}')
	})
})
