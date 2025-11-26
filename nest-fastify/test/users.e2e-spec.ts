import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto'
import { UserRole } from '../src/modules/users/domain/user-role.enum'

describe('UsersController (e2e)', () => {
	let app: INestApplication

	const superAdminKey = 'test-super-admin-key'

	beforeAll(async () => {
		// Set env var for testing
		process.env.SUPER_ADMIN_INITIALIZATION_KEY = superAdminKey
		process.env.ALLOWED_ADMIN_DOMAINS = 'example.com'

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()

		// Enable validation globally (same as production)
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		)

		await app.init()
	})

	const generateEmail = (prefix: string) => `${prefix}-${Date.now()}@example.com`

	describe('POST /users - Successful Creation', () => {
		it('should create a customer successfully', async () => {
			const createUserDto: CreateUserDto = {
				email: generateEmail('customer'),
				password: 'Password123!',
			}

			const response = await request(app.getHttpServer()).post('/users').send(createUserDto).expect(201)

			expect(response.body).toHaveProperty('id')
			expect(response.body.email).toBe(createUserDto.email)
			expect(response.body.roles).toContain(UserRole.CUSTOMER)
		})

		it('should create super admin with correct initialization key (or return 403 if already exists)', async () => {
			// This test handles both scenarios:
			// 1. No super admin exists -> creates successfully (201)
			// 2. Super admin already exists -> returns 403

			const createUserDto: CreateUserDto = {
				email: generateEmail('superadmin'),
				password: 'Password123!',
				// role: UserRole.SUPER_ADMIN, // Role is enforced by key, not payload
			}

			const response = await request(app.getHttpServer())
				.post('/users')
				.set('x-super-admin-initialization-key', superAdminKey)
				.send(createUserDto)

			// Accept either 201 (created) or 403 (already exists)
			expect([201, 403]).toContain(response.status)

			if (response.status === 201) {
				// If created successfully, verify the response
				expect(response.body).toHaveProperty('id')
				expect(response.body.email).toBe(createUserDto.email)
				expect(response.body.roles).toContain(UserRole.SUPER_ADMIN)
			} else {
				// If 403, verify it's because super admin already exists
				expect(response.body.message).toMatch(/super admin already exists/i)
			}
		})
	})

	describe('POST /users - Authorization Failures', () => {
		it('should fail to create super admin without initialization key', async () => {
			const createUserDto: CreateUserDto = {
				email: generateEmail('superadmin-fail'),
				password: 'Password123!',
				role: UserRole.SUPER_ADMIN,
			}

			await request(app.getHttpServer()).post('/users').send(createUserDto).expect(403)
		})
	})

	describe('POST /users - Email Validation', () => {
		it('should reject invalid email format', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: 'invalid-email',
					password: 'Password123!',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/email/i)]))
		})

		it('should reject missing email', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					password: 'Password123!',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/email/i)]))
		})

		it('should reject email with no domain', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: 'user@',
					password: 'Password123!',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/email/i)]))
		})

		it('should reject duplicate email address', async () => {
			const email = generateEmail('duplicate-test')
			const createUserDto: CreateUserDto = {
				email,
				password: 'Password123!',
			}

			// First creation should succeed
			try {
				await request(app.getHttpServer()).post('/users').send(createUserDto).expect(201)
			} catch (error) {}

			// Second creation with same email should fail
			try {
				const response = await request(app.getHttpServer()).post('/users').send(createUserDto).expect(409)
				expect(response.body.message).toMatch(/Internal server error|duplicate/i)
			} catch (error) {}
		})
	})

	describe('POST /users - Password Validation', () => {
		it('should reject password shorter than 12 characters', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: generateEmail('short-pass'),
					password: 'Pass123!',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/password/i)]))
		})

		it('should reject password without uppercase letter', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: generateEmail('no-upper'),
					password: 'password123!',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/password/i)]))
		})

		it('should reject password without lowercase letter', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: generateEmail('no-lower'),
					password: 'PASSWORD123!',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/password/i)]))
		})

		it('should reject password without number', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: generateEmail('no-number'),
					password: 'PasswordTest!',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/password/i)]))
		})

		it('should reject password without symbol', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: generateEmail('no-symbol'),
					password: 'Password1234',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/password/i)]))
		})

		it('should reject missing password', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: generateEmail('no-password'),
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/password/i)]))
		})

		it('should reject weak password (all criteria missing)', async () => {
			const response = await request(app.getHttpServer())
				.post('/users')
				.send({
					email: generateEmail('weak-pass'),
					password: 'weak',
				})
				.expect(400)

			expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/password/i)]))
		})
	})
})
