import User from "@modules/users/infra/typeorm/entities/User";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

/**
 * Um para Um (OneToOne) -> Um usuario tem apenas um agendamento
 * Um para muitos (OneToMany) -> Um usuario tem muitos agendamentos
 * MuitosParaMuitos (ManyToMany) -> Muitos usuarios tem muitos agendamentos
 */

@Entity("appointments")
class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "provider_id" })
  provider: User;

  @Column("timestamp with time zone")
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
