import { buildCsvContent } from '../export';

describe('buildCsvContent', () => {
  it('generates CSV header and rows', () => {
    const incomes = [
      {
        date: '2026-03-01',
        amount: 2550,
        platform: 'uber',
        platformCustom: null,
        odoStart: 1000,
        odoEnd: 1050,
        time: '08:30',
      },
    ];
    const expenses = [
      {
        date: '2026-03-01',
        amount: 15000,
        category: 'fuel',
        description: 'Shell',
        odoReading: 1050,
      },
    ];

    const csv = buildCsvContent(incomes, expenses);
    const lines = csv.split('\n');

    expect(lines[0]).toBe(
      'Data,Tipo,Categoria/Plataforma,Valor (R$),Km Inicio,Km Fim,Km Percorrida,Descricao',
    );
    expect(lines[1]).toBe('2026-03-01,Receita,uber,25.50,1000,1050,50,');
    expect(lines[2]).toBe('2026-03-01,Despesa,fuel,150.00,,,1050,Shell');
  });

  it('handles empty data', () => {
    const csv = buildCsvContent([], []);
    const lines = csv.split('\n');
    expect(lines.length).toBe(1); // header only
  });

  it('handles null odometer and description', () => {
    const incomes = [
      {
        date: '2026-03-02',
        amount: 1000,
        platform: '99',
        platformCustom: null,
        odoStart: null,
        odoEnd: null,
        time: null,
      },
    ];
    const csv = buildCsvContent(incomes, []);
    const lines = csv.split('\n');
    expect(lines[1]).toBe('2026-03-02,Receita,99,10.00,,,,');
  });
});
