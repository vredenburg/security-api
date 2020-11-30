import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUserRoles1606751248524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: 'role',
            type: 'varchar',
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "role");
    }

}
