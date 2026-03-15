import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DatePickerField, TimePickerField } from '../ui/DatePickerField';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../theme';
import { parseCurrencyToCents, centsToDecimal } from '../../utils/currency';
import { PLATFORMS } from '../../constants/categories';
import type { Income, NewIncome } from '../../db/queries/income';

interface IncomeFormProps {
  initialData?: Income;
  defaultPlatform?: string;
  defaultOdoStart?: number | null;
  onSubmit: (data: NewIncome) => Promise<void>;
  submitLabel: string;
}

export function IncomeForm({
  initialData,
  defaultPlatform = 'uber',
  defaultOdoStart = null,
  onSubmit,
  submitLabel,
}: IncomeFormProps) {
  const colors = useThemeColors();
  const now = new Date();

  const [amount, setAmount] = useState(
    initialData ? centsToDecimal(initialData.amount).toString() : '',
  );
  const [platform, setPlatform] = useState(initialData?.platform ?? defaultPlatform);
  const [platformCustom, setPlatformCustom] = useState(initialData?.platformCustom ?? '');
  const [odoStart, setOdoStart] = useState(
    initialData?.odoStart?.toString() ?? defaultOdoStart?.toString() ?? '',
  );
  const [odoEnd, setOdoEnd] = useState(initialData?.odoEnd?.toString() ?? '');
  const [date, setDate] = useState(initialData?.date ?? format(now, 'yyyy-MM-dd'));
  const [time, setTime] = useState(initialData?.time ?? format(now, 'HH:mm'));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const cents = parseCurrencyToCents(amount);
    if (cents <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    if (platform === 'other' && platformCustom.trim() === '') {
      newErrors.platformCustom = 'Informe o nome da plataforma';
    }
    if (odoStart && odoEnd) {
      const start = parseInt(odoStart, 10);
      const end = parseInt(odoEnd, 10);
      if (!isNaN(start) && !isNaN(end) && end < start) {
        newErrors.odoEnd = 'Odometro fim deve ser >= inicio';
      }
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
      await onSubmit({
        amount: parseCurrencyToCents(amount),
        platform,
        platformCustom: platform === 'other' ? platformCustom.trim() : null,
        odoStart: odoStart ? parseInt(odoStart, 10) : null,
        odoEnd: odoEnd ? parseInt(odoEnd, 10) : null,
        date,
        time: time || null,
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
      <Input
        label="Valor (R$)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0,00"
        error={errors.amount}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Plataforma</Text>
      <View style={styles.platformRow}>
        {PLATFORMS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setPlatform(p.id)}
            style={[
              styles.platformChip,
              {
                backgroundColor: platform === p.id ? colors.primary : colors.surfaceSecondary,
                borderColor: platform === p.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.platformChipText,
                { color: platform === p.id ? colors.primaryText : colors.text },
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {platform === 'other' && (
        <Input
          label="Nome da plataforma"
          value={platformCustom}
          onChangeText={setPlatformCustom}
          placeholder="Ex: Bolt"
          error={errors.platformCustom}
        />
      )}

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Input
            label="Odometro inicio (km)"
            value={odoStart}
            onChangeText={setOdoStart}
            keyboardType="numeric"
            placeholder="Opcional"
          />
        </View>
        <View style={styles.halfField}>
          <Input
            label="Odometro fim (km)"
            value={odoEnd}
            onChangeText={setOdoEnd}
            keyboardType="numeric"
            placeholder="Opcional"
            error={errors.odoEnd}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <DatePickerField label="Data" value={date} onChange={setDate} error={errors.date} />
        </View>
        <View style={styles.halfField}>
          <TimePickerField label="Hora" value={time} onChange={setTime} />
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
  platformRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  platformChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  platformChipText: { fontSize: fontSize.sm, fontWeight: '500' },
  row: { flexDirection: 'row', gap: spacing.sm },
  halfField: { flex: 1 },
  submitArea: { marginTop: spacing.lg },
});
