import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql'
import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { hash, verify } from '@node-rs/argon2'
import { UserRole } from './domain/user-role.enum'
import { User } from './domain/user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name)

	constructor(
		@InjectRepository(User)
		private readonly userRepository: EntityRepository<User>,
		private readonly em: EntityManager,
		private readonly configService: ConfigService,
	) {}

	async hashPassword(password: string): Promise<string> {
		return hash(password)
	}

	async verifyPassword(password: string, hash: string): Promise<boolean> {
		return verify(hash, password)
	}

	async create(email: string, passwordPlain: string, roles: string[] = [UserRole.CUSTOMER], permissions: string[] = []): Promise<User> {
		const hashedPassword = await this.hashPassword(passwordPlain)
		const user = this.userRepository.create({ email, password: hashedPassword, roles, permissions })
		await this.em.persistAndFlush(user)
		return user
	}

	async createSuperAdmin(dto: CreateUserDto, initializationKey: string): Promise<User> {
		// Validate initialization key
		const envKey = this.configService.get<string>('SUPER_ADMIN_INITIALIZATION_KEY')
		if (!envKey || initializationKey !== envKey) {
			throw new ForbiddenException('Invalid super admin initialization key.')
		}

		// Check if super admin already exists
		if (await this.hasSuperAdmin()) {
			throw new ForbiddenException('Super admin already exists.')
		}

		// Validate email domain
		const allowedDomains = this.configService.get<string>('ALLOWED_ADMIN_DOMAINS')?.split(',') || []
		const userDomain = dto.email.split('@')[1]
		if (!userDomain || !allowedDomains.includes(userDomain)) {
			throw new BadRequestException('Email domain not allowed for super admin.')
		}

		return this.create(dto.email, dto.password, [UserRole.SUPER_ADMIN])
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.userRepository.findOne({ email })
	}

	async findById(id: string): Promise<User | null> {
		return this.userRepository.findOne({ id })
	}

	async hasSuperAdmin(): Promise<boolean> {
		const count = await this.userRepository.count({
			roles: { $contains: [UserRole.SUPER_ADMIN] },
		})
		return count > 0
	}
}
