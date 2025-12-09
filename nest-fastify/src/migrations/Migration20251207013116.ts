import { Migration } from '@mikro-orm/migrations'

export class Migration20251207013116 extends Migration {
	override up(): void {
		this.addSql(
			`create table "users" (
				"user_id" text not null,
				"email" citext not null,
				"password" text not null,
				"roles" text[] not null default '{customer}',
				"permissions" text[] not null default '{}',
				"created_at" timestamptz not null,
				"updated_at" timestamptz not null,
				constraint "users_pkey" primary key ("user_id"),
				constraint "users_email_unique" unique ("email"),
				constraint "users_id_length" check (LENGTH(user_id) = 24)
			);`,
		)
	}

	override down(): void {
		this.addSql(`drop table if exists "users" cascade;`)
	}
}
