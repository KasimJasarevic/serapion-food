import {MigrationInterface, QueryRunner} from "typeorm";

export class DefaultTimestamp1642039305845 implements MigrationInterface {
    name = 'DefaultTimestamp1642039305845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`opened_at\` \`opened_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`opened_at\` \`opened_at\` timestamp NOT NULL`);
    }

}
