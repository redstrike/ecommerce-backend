import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

	// Enable validation globally
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Strip properties that don't have decorators
			forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
			transform: true, // Automatically transform payloads to DTO instances
		}),
	)

	// Enable password exclusion globally
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

	await app.listen(process.env.PORT ?? 3000, '127.0.0.1')
}

bootstrap()
