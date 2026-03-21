import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1774092441051 implements MigrationInterface {
    name = 'InitialSchema1774092441051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "isChatJoinMessage" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "isChatJoinMessage"`);
    }

}
