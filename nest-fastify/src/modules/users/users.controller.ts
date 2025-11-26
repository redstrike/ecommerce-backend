import { Body, Controller, ForbiddenException, Headers, Post } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserRole } from './domain/user-role.enum'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(
		@Headers('x-super-admin-initialization-key') superAdminInitializationKey: string | undefined,
		@Body() createUserDto: CreateUserDto,
	) {
		// Super admin creation via initialization key
		if (superAdminInitializationKey) {
			return this.usersService.createSuperAdmin(createUserDto, superAdminInitializationKey)
		}

		// Reject super admin creation without initialization key
		if (createUserDto.role === UserRole.SUPER_ADMIN) {
			throw new ForbiddenException('Super admin can only be created using the initialization key.')
		}

		// Admin creation (requires authentication - not yet implemented)
		if (createUserDto.role === UserRole.ADMIN) {
			throw new ForbiddenException(
				'Admin creation requires authentication. This feature will be available after authentication is implemented.',
			)
		}

		// Customer creation (default)
		return this.usersService.create(createUserDto.email, createUserDto.password)
	}
}
