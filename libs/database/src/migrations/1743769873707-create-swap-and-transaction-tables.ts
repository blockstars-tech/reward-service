import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSwapAndTransactionTables1743769873707
  implements MigrationInterface
{
  name = 'CreateSwapAndTransactionTables1743769873707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "swaps" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" text NOT NULL, "dst_network" text, "dst_asset" text, "src_network" text, "src_asset" text, "hashlock" text, "secret" text, "timelock" bigint, "reward" numeric, "reward_timelock" bigint, "status" smallint NOT NULL DEFAULT '0', "scheduled_at" TIMESTAMP, CONSTRAINT "PK_4297e409c8f0be9cb39d520be2b" PRIMARY KEY ("id")); COMMENT ON COLUMN "swaps"."status" IS '0: IN_PROGRESS, 2: REFUNDED, 3: REDEEMED'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dfc6ed8dae0f825014b95ba7c9" ON "swaps" ("reward_timelock", "status", "scheduled_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "swap_id" text NOT NULL, "network" text NOT NULL, "address" text NOT NULL, "fee" bigint, "hash" text, "status" smallint NOT NULL DEFAULT '0', "error" text, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")); COMMENT ON COLUMN "transactions"."status" IS '0: PENDING, 1: SUCCESS, 2: FAILED, 3: REPLACED'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09b9bb56a5c09336815696e76a" ON "transactions" ("swap_id", "hash", "status") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_09b9bb56a5c09336815696e76a"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dfc6ed8dae0f825014b95ba7c9"`,
    );
    await queryRunner.query(`DROP TABLE "swaps"`);
  }
}
