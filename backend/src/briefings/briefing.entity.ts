import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Socio } from './socio.entity';

@Entity('briefings')
export class Briefing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Dados Gerais
  @Column()
  nomeCliente: string;

  @Column()
  cpfCnpj: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column()
  finalidade: string; // 'abertura', 'regularizacao', 'viabilidade'

  // Tipo de Entidade
  // Número de Protocolo único
  @Column({ unique: true, nullable: true })
  protocolo: string;

  @Column()
  tipoEntidade: string; // 'associacao', 'oscip', 'spe', 'sa', 'holding', 'limitada', 'simples'

  @Column()
  entidadeNome: string;

  // Dados completos da API Infosimples (quando consultado via CNPJ)
  @Column('jsonb', { nullable: true })
  dadosInfosimples: Record<string, any>;

  // Endereço (JSON)
  @Column('jsonb')
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    tipoImovel: string;
  };

  @Column('text')
  objetoSocial: string;

  @Column({ nullable: true })
  faturamentoEstimado: string;

  // Inscrições (JSON)
  @Column('jsonb')
  inscricoes: {
    estadual: boolean;
    municipal: boolean;
    especial: boolean;
  };

  // Sócios (relação)
  @OneToMany(() => Socio, (socio) => socio.briefing, {
    cascade: true,
    eager: true,
  })
  socios: Socio[];

  // Informações Específicas (JSON - varia por tipo de entidade)
  @Column('jsonb', { nullable: true })
  especificos: Record<string, any>;

  // Relacionamento com usuário
  @ManyToOne(() => User, (user) => user.briefings, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  // Status do briefing
  @Column({ default: 'rascunho' })
  status: string; // 'rascunho', 'completo', 'em_analise', 'aprovado'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
