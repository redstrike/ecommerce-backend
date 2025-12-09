import { Check, Entity, Opt, PrimaryKey, Property } from '@mikro-orm/core'
import cuid2 from '@paralleldrive/cuid2'
import { Exclude } from 'class-transformer'
import { UserRole } from './user-role.enum'

const USER_ID_COLUMN_NAME = 'user_id'
const CUID2_DEFAULT_LENGTH = 24 // Range: [2, 32]

@Entity({ tableName: 'users' })
@Check({ name: 'users_id_length', expression: `LENGTH(${USER_ID_COLUMN_NAME}) = ${CUID2_DEFAULT_LENGTH}` })
export class User {
	@PrimaryKey({ name: USER_ID_COLUMN_NAME, type: 'text' })
	id: string = cuid2.createId()

	@Property({ unique: true, type: 'citext' })
	email!: string

	@Exclude()
	@Property({ type: 'text' })
	password!: string

	@Property({ type: 'text[]', default: [UserRole.CUSTOMER] })
	roles: string[] = [UserRole.CUSTOMER]

	@Property({ type: 'text[]', default: [] })
	permissions: string[] = []

	@Property({ type: 'timestamptz', name: 'created_at', onCreate: () => new Date() })
	createdAt: Opt<Date> = new Date()

	@Property({ type: 'timestamptz', name: 'updated_at', onUpdate: () => new Date() })
	updatedAt: Opt<Date> = new Date()
}
