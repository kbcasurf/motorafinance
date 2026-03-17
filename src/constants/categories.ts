export interface ExpenseCategory {
  id: string;
  label: string;
}

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'fuel', label: 'Abastecimento' },
  { id: 'washing', label: 'Lavagem/Higienizacao' },
  { id: 'accessories', label: 'Acessorios/Equipamentos' },
  { id: 'internet', label: 'Plano de Internet Movel' },
  { id: 'preventive_maintenance', label: 'Manutencao Preventiva' },
  { id: 'corrective_maintenance', label: 'Manutencao Corretiva' },
  { id: 'insurance', label: 'Seguro do Veiculo' },
  { id: 'tax', label: 'IPVA/Licenciamento' },
  { id: 'depreciation', label: 'Depreciacao' },
  { id: 'other', label: 'Outros' },
];

export const PLATFORMS = [
  { id: 'uber', label: 'Uber' },
  { id: '99', label: '99' },
  { id: 'chama27', label: 'Chama27' },
  { id: 'other', label: 'Outro' },
] as const;

export const FUEL_TYPES = [
  { id: 'gasoline', label: 'Gasolina' },
  { id: 'ethanol', label: 'Etanol' },
  { id: 'gnv', label: 'GNV' },
  { id: 'diesel', label: 'Diesel' },
] as const;
