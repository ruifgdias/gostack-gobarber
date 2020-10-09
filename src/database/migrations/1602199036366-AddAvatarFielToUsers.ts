import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export default class AddAvatarFielToUsers1602199036366 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.addColumn('users', new TableColumn({
            name: 'avatar',
            type: 'varchar',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropColumn('users','avatar');
    }

}