import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AlterTableAppointments1645721713091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("appointments", "provider");

    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "provider_id",
        //type: "uuid",
        type: "varchar",
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "created_at",
        type: "timestamp",
        default: "now()",
      }),
    );

    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "updated_at",
        type: "timestamp",
        default: "now()",
      }),
    );

    await queryRunner.createForeignKey(
      "appointments",
      new TableForeignKey({
        name: "FKAppointmentProvider",
        columnNames: ["provider_id"],
        referencedColumnNames: ["id"], // nome na coluna
        referencedTableName: "users", //  nome da tabela que ira fazer o JOIN
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("appointments", "FKAppointmentProvider");

    await queryRunner.dropColumns("appointments", [
      "provider_id",
      "created_at",
      "updated_at",
    ]);

    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "provider",
        type: "varchar",
      }),
    );
  }
}
