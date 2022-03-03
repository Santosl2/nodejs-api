import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddUserIdToAppointments1646318210777
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "user_id",
        //type: "uuid",
        type: "varchar",
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      "appointments",
      new TableForeignKey({
        name: "FKAppointmentUser",
        columnNames: ["user_id"],
        referencedColumnNames: ["id"], // nome na coluna
        referencedTableName: "users", //  nome da tabela que ira fazer o JOIN
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("appointments", "FKAppointmentUser");

    await queryRunner.dropColumn("appointments", "user_id");
  }
}
