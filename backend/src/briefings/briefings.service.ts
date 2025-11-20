import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Briefing } from './briefing.entity';
import { CreateBriefingDto } from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';
import { FilterBriefingDto } from './dto/filter-briefing.dto';

@Injectable()
export class BriefingsService {
  constructor(
    @InjectRepository(Briefing)
    private briefingsRepository: Repository<Briefing>,
  ) {}

  /**
   * Gera um número de protocolo único no formato: BRF-YYYYMMDD-XXXX
   * Exemplo: BRF-20251117-0001
   */
  private async generateProtocolo(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    // Buscar último protocolo do dia
    const lastBriefing = await this.briefingsRepository
      .createQueryBuilder('briefing')
      .where('briefing.protocolo LIKE :prefix', { prefix: `BRF-${datePrefix}-%` })
      .orderBy('briefing.protocolo', 'DESC')
      .getOne();

    let sequencial = 1;
    if (lastBriefing && lastBriefing.protocolo) {
      const lastSequencial = parseInt(lastBriefing.protocolo.split('-')[2]);
      sequencial = lastSequencial + 1;
    }

    const sequencialPadded = String(sequencial).padStart(4, '0');
    return `BRF-${datePrefix}-${sequencialPadded}`;
  }

  async create(createBriefingDto: CreateBriefingDto, userId?: string): Promise<Briefing> {
    // Gerar protocolo único
    const protocolo = await this.generateProtocolo();

    // Separar os sócios do DTO para evitar erro de tipagem
    const { socios, ...briefingData } = createBriefingDto;

    const briefing = this.briefingsRepository.create({
      ...briefingData,
      protocolo,
      userId,
    });

    const savedBriefing = await this.briefingsRepository.save(briefing);

    // TODO: Salvar sócios separadamente se necessário
    // Por enquanto, TypeORM vai tentar salvar automaticamente devido à relação cascade

    return savedBriefing;
  }

  async findAll(filters?: FilterBriefingDto): Promise<{ data: Briefing[]; total: number }> {
    const queryBuilder = this.briefingsRepository
      .createQueryBuilder('briefing')
      .leftJoinAndSelect('briefing.socios', 'socios')
      .leftJoinAndSelect('briefing.user', 'user');

    // Filtros
    if (filters?.search) {
      queryBuilder.andWhere(
        '(briefing.nomeCliente ILIKE :search OR briefing.cpfCnpj ILIKE :search OR briefing.entidadeNome ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.tipoEntidade) {
      queryBuilder.andWhere('briefing.tipoEntidade = :tipoEntidade', {
        tipoEntidade: filters.tipoEntidade,
      });
    }

    if (filters?.status) {
      queryBuilder.andWhere('briefing.status = :status', { status: filters.status });
    }

    if (filters?.finalidade) {
      queryBuilder.andWhere('briefing.finalidade = :finalidade', {
        finalidade: filters.finalidade,
      });
    }

    if (filters?.dataInicio && filters?.dataFim) {
      queryBuilder.andWhere('briefing.createdAt BETWEEN :dataInicio AND :dataFim', {
        dataInicio: filters.dataInicio,
        dataFim: filters.dataFim,
      });
    }

    if (filters?.userId) {
      queryBuilder.andWhere('briefing.userId = :userId', { userId: filters.userId });
    }

    // Ordenação
    const orderBy = filters?.orderBy || 'createdAt';
    const order = filters?.order || 'DESC';
    queryBuilder.orderBy(`briefing.${orderBy}`, order as 'ASC' | 'DESC');

    // Paginação
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<Briefing> {
    const briefing = await this.briefingsRepository.findOne({
      where: { id },
      relations: ['socios', 'user'],
    });

    if (!briefing) {
      throw new NotFoundException('Briefing não encontrado');
    }

    return briefing;
  }

  /**
   * Busca briefing por número de protocolo
   */
  async findByProtocolo(protocolo: string): Promise<Briefing> {
    const briefing = await this.briefingsRepository.findOne({
      where: { protocolo },
      relations: ['socios', 'user'],
    });

    if (!briefing) {
      throw new NotFoundException(`Briefing com protocolo ${protocolo} não encontrado`);
    }

    return briefing;
  }

  async update(id: string, updateBriefingDto: UpdateBriefingDto): Promise<Briefing> {
    const briefing = await this.findOne(id);
    Object.assign(briefing, updateBriefingDto);
    return this.briefingsRepository.save(briefing);
  }

  async remove(id: string): Promise<void> {
    const briefing = await this.findOne(id);
    await this.briefingsRepository.remove(briefing);
  }

  // Estatísticas para Dashboard
  async getStatistics(): Promise<any> {
    const total = await this.briefingsRepository.count();

    const porTipo = await this.briefingsRepository
      .createQueryBuilder('briefing')
      .select('briefing.tipoEntidade', 'tipo')
      .addSelect('COUNT(*)', 'count')
      .groupBy('briefing.tipoEntidade')
      .getRawMany();

    const porStatus = await this.briefingsRepository
      .createQueryBuilder('briefing')
      .select('briefing.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('briefing.status')
      .getRawMany();

    const porFinalidade = await this.briefingsRepository
      .createQueryBuilder('briefing')
      .select('briefing.finalidade', 'finalidade')
      .addSelect('COUNT(*)', 'count')
      .groupBy('briefing.finalidade')
      .getRawMany();

    const porMes = await this.briefingsRepository
      .createQueryBuilder('briefing')
      .select("TO_CHAR(briefing.createdAt, 'YYYY-MM')", 'mes')
      .addSelect('COUNT(*)', 'count')
      .groupBy('mes')
      .orderBy('mes', 'DESC')
      .limit(12)
      .getRawMany();

    const recentes = await this.briefingsRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user'],
    });

    return {
      total,
      porTipo,
      porStatus,
      porFinalidade,
      porMes,
      recentes,
    };
  }
}
