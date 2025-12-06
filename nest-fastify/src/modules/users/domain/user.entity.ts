import cuid2 from '@paralleldrive/cuid2'
import { Exclude } from 'class-transformer'
import { Check, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { UserRole } from './user-role.enum'

const USER_ID_COLUMN_NAME = 'user_id'
const CUID2_DEFAULT_LENGTH = 24 // Range: [2, 32]

@Entity('users')
@Check('user_id_length_check', `LENGTH(${USER_ID_COLUMN_NAME}) = ${CUID2_DEFAULT_LENGTH}`)
export class User {
	@PrimaryColumn({ name: USER_ID_COLUMN_NAME, type: 'text' })
	id: string = cuid2.createId()

	@Column({ unique: true, type: 'citext' })
	email: string

	@Exclude()
	@Column({ type: 'text' })
	password: string

	@Column({ type: 'text', array: true, default: [UserRole.CUSTOMER] })
	roles: string[]

	@Column({ type: 'text', array: true, default: [] })
	permissions: string[]

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt: Date
}
