import {MigrationInterface, QueryRunner} from "typeorm";

export class DefaultTimestampComments1642129833411 implements MigrationInterface {
    name = 'DefaultTimestampComments1642129833411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`commented_on\` \`commented_on\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`commented_on\` \`commented_on\` timestamp NOT NULL`);
    }

}
