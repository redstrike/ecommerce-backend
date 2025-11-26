import { IsEmail, IsEnum, IsOptional, IsArray, IsStrongPassword } from 'class-validator'
import { UserRole } from '../domain/user-role.enum'
import { UserPermission } from '../domain/user-permission.enum'

export class CreateUserDto {
	@IsEmail()
	email: string

	@IsStrongPassword({
		minLength: 12,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password: string

	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole

	@IsOptional()
	@IsArray()
	@IsEnum(UserPermission, { each: true })
	permissions?: UserPermission[]
}
