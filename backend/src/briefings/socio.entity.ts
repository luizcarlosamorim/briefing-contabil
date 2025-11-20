import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Briefing } from './briefing.entity';

@Entity('socios')
export class Socio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo: string; // 'pf' ou 'pj'

  @Column()
  nome: string;

  @Column()
  cpfCnpj: string;

  @Column({ nullable: true })
  rg: string;

  @Column({ nullable: true })
  estadoCivil: string;

  @Column({ nullable: true })
  regimeBens: string;

  @Column({ nullable: true })
  endereco: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telefone: string;

  @Column('decimal', { precision: 5, scale: 2 })
  participacao: number; // Porcentagem

  @Column({ default: false })
  administrador: boolean;

  @Column({ default: 'nao' })
  restricoes: string; // 'sim', 'nao', 'nao-sabe'

  @ManyToOne(() => Briefing, (briefing) => briefing.socios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'briefingId' })
  briefing: Briefing;

  @Column()
  briefingId: string;
}
