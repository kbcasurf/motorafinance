import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DatePickerField } from '../ui/DatePickerField';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../theme';
import { parseCurrencyToCents, centsToDecimal } from '../../utils/currency';
import { DEFAULT_EXPENSE_CATEGORIES, FUEL_TYPES } from '../../constants/categories';
import { useLiveCustomCategories } from '../../hooks/useLiveCustomCategories';
import type { Expense, NewExpense } from '../../db/queries/expenses';

interface ExpenseFormProps {
  initialData?: Expense;
  defaultCategory?: string;
  onSubmit: (data: NewExpense) => Promise<void>;
  submitLabel: string;
}

export function ExpenseForm({
  initialData,
  defaultCategory = 'fuel',
  onSubmit,
  submitLabel,
}: ExpenseFormProps) {
  const colors = useThemeColors();
  const { data: customCats } = useLiveCustomCategories();

  const allCategories = [
    ...DEFAULT_EXPENSE_CATEGORIES,
    ...customCats.map((c) => ({ id: c.id, label: c.name })),
  ];

  const [amount, setAmount] = useState(
    initialData ? centsToDecimal(initialData.amount).toString() : '',
  );
  const [category, setCategory] = useState(initialData?.category ?? defaultCategory);
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [odoReading, setOdoReading] = useState(initialData?.odoReading?.toString() ?? '');
  const [date, setDate] = useState(initialData?.date ?? format(new Date(), 'yyyy-MM-dd'));
  const [fuelType, setFuelType] = useState(initialData?.fuelType ?? 'gasoline');
  const [fuelLiters, setFuelLiters] = useState(
    initialData?.fuelLiters ? (initialData.fuelLiters / 1000).toString() : '',
  );
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(
    initialData?.fuelPricePerLiter ? centsToDecimal(initialData.fuelPricePerLiter).toString() : '',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isFuel = category === 'fuel';

  // Auto-calculate amount from fuel fields
  useEffect(() => {
    if (!isFuel) return;
    const liters = parseFloat(fuelLiters.replace(',', '.'));
    const price = parseFloat(fuelPricePerLiter.replace(',', '.'));
    if (!isNaN(liters) && !isNaN(price) && liters > 0 && price > 0) {
      setAmount((liters * price).toFixed(2));
    }
  }, [fuelLiters, fuelPricePerLiter, isFuel]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const cents = parseCurrencyToCents(amount);
    if (cents <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    if (!category) {
      newErrors.category = 'Categoria e obrigatoria';
    }
    if (!date) {
      newErrors.date = 'Data e obrigatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const litersVal = fuelLiters ? parseFloat(fuelLiters.replace(',', '.')) : null;
      const priceVal = fuelPricePerLiter ? parseFloat(fuelPricePerLiter.replace(',', '.')) : null;

      await onSubmit({
        amount: parseCurrencyToCents(amount),
        category,
        description: description.trim() || null,
        odoReading: odoReading ? parseInt(odoReading, 10) : null,
        date,
        fuelType: isFuel ? fuelType : null,
        fuelLiters: isFuel && litersVal ? Math.round(litersVal * 1000) : null,
        fuelPricePerLiter: isFuel && priceVal ? Math.round(priceVal * 100) : null,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria</Text>
      <View style={styles.chipRow}>
        {allCategories.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCategory(c.id)}
            style={[
              styles.chip,
              {
                backgroundColor: category === c.id ? colors.primary : colors.surfaceSecondary,
                borderColor: category === c.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: category === c.id ? colors.primaryText : colors.text },
              ]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {errors.category && (
        <Text style={[styles.errorText, { color: colors.negative }]}>{errors.category}</Text>
      )}

      {isFuel && (
        <>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo de combustivel</Text>
          <View style={styles.chipRow}>
            {FUEL_TYPES.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setFuelType(f.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: fuelType === f.id ? colors.primary : colors.surfaceSecondary,
                    borderColor: fuelType === f.id ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: fuelType === f.id ? colors.primaryText : colors.text },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="Litros"
                value={fuelLiters}
                onChangeText={setFuelLiters}
                keyboardType="decimal-pad"
                placeholder="Ex: 40,5"
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="Preco/litro (R$)"
                value={fuelPricePerLiter}
                onChangeText={setFuelPricePerLiter}
                keyboardType="decimal-pad"
                placeholder="Ex: 5,89"
              />
            </View>
          </View>
        </>
      )}

      <Input
        label="Valor total (R$)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0,00"
        error={errors.amount}
      />

      <Input
        label="Descricao (opcional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Ex: Troca de oleo"
      />

      <View style={styles.row}>
        <View style={styles.halfField}>
          <DatePickerField label="Data" value={date} onChange={setDate} error={errors.date} />
        </View>
        <View style={styles.halfField}>
          <Input
            label="Odometro (km)"
            value={odoReading}
            onChangeText={setOdoReading}
            keyboardType="numeric"
            placeholder="Opcional"
          />
        </View>
      </View>

      <View style={styles.submitArea}>
        <Button title={submitLabel} onPress={handleSubmit} disabled={submitting} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  label: { fontSize: fontSize.sm, marginBottom: spacing.xs, fontWeight: '500' },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  chipText: { fontSize: fontSize.sm, fontWeight: '500' },
  errorText: { fontSize: fontSize.xs, marginTop: -spacing.sm, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  halfField: { flex: 1 },
  submitArea: { marginTop: spacing.lg },
});
