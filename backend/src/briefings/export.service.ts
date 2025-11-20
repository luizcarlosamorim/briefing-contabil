import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Briefing } from './briefing.entity';

@Injectable()
export class ExportService {
  async exportToExcel(briefings: Briefing[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Briefings');

    // Cabeçalhos
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 38 },
      { header: 'Nome do Cliente', key: 'nomeCliente', width: 30 },
      { header: 'CPF/CNPJ', key: 'cpfCnpj', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Telefone', key: 'telefone', width: 18 },
      { header: 'Tipo de Entidade', key: 'tipoEntidade', width: 20 },
      { header: 'Nome da Entidade', key: 'entidadeNome', width: 30 },
      { header: 'Finalidade', key: 'finalidade', width: 18 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Cidade', key: 'cidade', width: 25 },
      { header: 'UF', key: 'uf', width: 5 },
      { header: 'Nº Sócios', key: 'numSocios', width: 12 },
      { header: 'Data de Criação', key: 'createdAt', width: 20 },
    ];

    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Adicionar dados
    briefings.forEach((briefing) => {
      worksheet.addRow({
        id: briefing.id,
        nomeCliente: briefing.nomeCliente,
        cpfCnpj: briefing.cpfCnpj,
        email: briefing.email,
        telefone: briefing.telefone,
        tipoEntidade: briefing.tipoEntidade,
        entidadeNome: briefing.entidadeNome,
        finalidade: briefing.finalidade,
        status: briefing.status,
        cidade: briefing.endereco?.cidade || '',
        uf: briefing.endereco?.uf || '',
        numSocios: briefing.socios?.length || 0,
        createdAt: briefing.createdAt
          ? new Date(briefing.createdAt).toLocaleString('pt-BR')
          : '',
      });
    });

    // Gerar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportToCSV(briefings: Briefing[]): Promise<string> {
    const headers = [
      'ID',
      'Nome do Cliente',
      'CPF/CNPJ',
      'Email',
      'Telefone',
      'Tipo de Entidade',
      'Nome da Entidade',
      'Finalidade',
      'Status',
      'Cidade',
      'UF',
      'Nº Sócios',
      'Data de Criação',
    ];

    const rows = briefings.map((briefing) => [
      briefing.id,
      briefing.nomeCliente,
      briefing.cpfCnpj,
      briefing.email,
      briefing.telefone,
      briefing.tipoEntidade,
      briefing.entidadeNome,
      briefing.finalidade,
      briefing.status,
      briefing.endereco?.cidade || '',
      briefing.endereco?.uf || '',
      briefing.socios?.length || 0,
      briefing.createdAt
        ? new Date(briefing.createdAt).toLocaleString('pt-BR')
        : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n');

    return csvContent;
  }
}
