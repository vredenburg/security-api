import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddUser1606056015383 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: "email",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "first_name",
                    type: "varchar",
                },
                {
                    name: "last_name",
                    type: "varchar",
                },
                {
                    name: 'created_on',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_on',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }), true);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
    }

}
