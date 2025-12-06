import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764637688664 implements MigrationInterface {
    name = 'Migration1764637688664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("user_id" text NOT NULL, "email" citext NOT NULL, "password" text NOT NULL, "roles" text array NOT NULL DEFAULT '{customer}', "permissions" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "user_id_length_check" CHECK (LENGTH(user_id) = 24), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
