import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrderStatus1657726172330 implements MigrationInterface {
    name = 'AddOrderStatus1657726172330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('INACTIVE', 'LOCKED', 'ACTIVE') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('INACTIVE', 'ACTIVE') NOT NULL`);
    }

}
