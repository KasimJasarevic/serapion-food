import {MigrationInterface, QueryRunner} from "typeorm";

export class RestaurantMenuTypeChange1641564359068 implements MigrationInterface {
    name = 'RestaurantMenuTypeChange1641564359068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`restaurant\` DROP COLUMN \`menu\``);
        await queryRunner.query(`ALTER TABLE \`restaurant\` ADD \`menu\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`restaurant\` DROP COLUMN \`menu\``);
        await queryRunner.query(`ALTER TABLE \`restaurant\` ADD \`menu\` varchar(255) NULL`);
    }

}
