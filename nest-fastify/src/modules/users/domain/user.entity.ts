import { createId } from '@paralleldrive/cuid2'
import { Exclude } from 'class-transformer'
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { UserRole } from './user-role.enum'

const CUID2_DEFAULT_LENGTH = 24 // Max length is 32

@Entity('users')
export class User {
	@PrimaryColumn({ name: 'user_id', type: 'char', length: CUID2_DEFAULT_LENGTH })
	id: string = createId()

	@Column({ unique: true })
	email: string

	@Exclude()
	@Column()
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
