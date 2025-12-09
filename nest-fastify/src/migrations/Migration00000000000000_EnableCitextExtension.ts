import { Migration } from '@mikro-orm/migrations'

export class Migration00000000000000_EnableCitextExtension extends Migration {
	override up(): void {
		this.addSql('CREATE EXTENSION IF NOT EXISTS citext;')
	}

	override down(): void {
		// Note: Dropping citext extension would break any columns using it
		// Only uncomment if you're sure no other tables use citext
		// this.addSql('DROP EXTENSION IF EXISTS citext;')
	}
}
