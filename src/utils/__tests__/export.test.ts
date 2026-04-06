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

    const csv = buildCsvContent(incomes, expenses, []);
    const lines = csv.split('\n');

    expect(lines[0]).toBe(
      'Data,Tipo,Categoria/Plataforma,Valor (R$),Km Inicio,Km Fim,Km Percorrida,Descricao',
    );
    expect(lines[1]).toBe('2026-03-01,Receita,uber,25.50,1000,1050,50,');
    expect(lines[2]).toBe('2026-03-01,Despesa,fuel,150.00,,,1050,Shell');
  });

  it('handles empty data', () => {
    const csv = buildCsvContent([], [], []);
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
    const csv = buildCsvContent(incomes, [], []);
    const lines = csv.split('\n');
    expect(lines[1]).toBe('2026-03-02,Receita,99,10.00,,,,');
  });

  it('includes extras rows in output', () => {
    const extras = [
      {
        date: '2026-03-05',
        odoStart: 2000,
        odoEnd: 2150,
        timeStart: '08:00',
        timeEnd: '12:00',
        routeType: 'highway',
      },
    ];
    const csv = buildCsvContent([], [], extras);
    const lines = csv.split('\n');

    expect(lines[0]).toBe(
      'Data,Tipo,Categoria/Plataforma,Valor (R$),Km Inicio,Km Fim,Km Percorrida,Descricao',
    );
    expect(lines[1]).toBe(
      '2026-03-05,Extra,Viagem,,2000,2150,150,08:00 - 12:00',
    );
  });

  it('labels urban extras correctly', () => {
    const extras = [
      {
        date: '2026-03-06',
        odoStart: 3000,
        odoEnd: 3050,
        timeStart: '14:00',
        timeEnd: '18:00',
        routeType: 'urban',
      },
    ];
    const csv = buildCsvContent([], [], extras);
    const lines = csv.split('\n');

    expect(lines[1]).toBe(
      '2026-03-06,Extra,Urbano,,3000,3050,50,14:00 - 18:00',
    );
  });

  it('combines all three types correctly', () => {
    const incomes = [
      {
        date: '2026-03-01',
        amount: 5000,
        platform: 'uber',
        platformCustom: null,
        odoStart: 1000,
        odoEnd: 1060,
        time: null,
      },
    ];
    const expenses = [
      {
        date: '2026-03-01',
        amount: 20000,
        category: 'fuel',
        description: 'Gasolina',
        odoReading: 1060,
      },
    ];
    const extras = [
      {
        date: '2026-03-02',
        odoStart: 1060,
        odoEnd: 1100,
        timeStart: '06:00',
        timeEnd: '09:00',
        routeType: 'urban',
      },
    ];
    const csv = buildCsvContent(incomes, expenses, extras);
    const lines = csv.split('\n');

    expect(lines.length).toBe(4); // header + 1 income + 1 expense + 1 extra
    expect(lines[0]).toContain('Tipo');
    expect(lines[1]).toContain('Receita');
    expect(lines[2]).toContain('Despesa');
    expect(lines[3]).toContain('Extra');
  });
});
