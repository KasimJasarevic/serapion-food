import {MigrationInterface, QueryRunner} from "typeorm";

export class OrderEntityArrivalTime1643623953044 implements MigrationInterface {
    name = 'OrderEntityArrivalTime1643623953044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`opened_at\` \`opened_at\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`opened_at\` \`opened_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

}
