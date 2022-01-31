import {MigrationInterface, QueryRunner} from "typeorm";

export class OrderEntityArrivalTime1643624018225 implements MigrationInterface {
    name = 'OrderEntityArrivalTime1643624018225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`arrival_time\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`opened_at\` \`opened_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`opened_at\` \`opened_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`arrival_time\``);
    }

}
