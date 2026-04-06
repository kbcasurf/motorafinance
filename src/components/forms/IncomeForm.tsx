import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DatePickerField, TimePickerField } from '../ui/DatePickerField';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../theme';
import { parseCurrencyToCents, centsToDecimal } from '../../utils/currency';
import { PLATFORMS } from '../../constants/categories';
import type { Income, NewIncome } from '../../db/queries/income';

const ROUTE_TYPES = [
  { id: 'urban' as const, label: 'Urbano' },
  { id: 'highway' as const, label: 'Em viagem' },
];

interface IncomeFormProps {
  initialData?: Income;
  defaultPlatform?: string;
  defaultOdoStart?: number | null;
  onSubmit: (data: NewIncome) => Promise<void>;
  submitLabel: string;
  dateError?: string;
  onClearDateError?: () => void;
}

export function IncomeForm({
  initialData,
  defaultPlatform = 'uber',
  defaultOdoStart = null,
  onSubmit,
  submitLabel,
  dateError,
  onClearDateError,
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
  function handleDateChange(value: string) {
    setDate(value);
    onClearDateError?.();
  }
  const [timeStart, setTimeStart] = useState(initialData?.timeStart ?? '00:00');
  const [timeEnd, setTimeEnd] = useState(initialData?.timeEnd ?? '23:59');
  const [routeType, setRouteType] = useState<'urban' | 'highway'>(
    initialData?.routeType === 'highway' ? 'highway' : 'urban',
  );
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
    if (!odoStart || odoStart.trim() === '') {
      newErrors.odoStart = 'Odômetro início é obrigatório';
    }
    if (!odoEnd || odoEnd.trim() === '') {
      newErrors.odoEnd = 'Odômetro fim é obrigatório';
    }
    if (odoStart && odoEnd) {
      const start = parseInt(odoStart, 10);
      const end = parseInt(odoEnd, 10);
      if (!isNaN(start) && !isNaN(end) && end < start) {
        newErrors.odoEnd = 'Odômetro fim deve ser maior ou igual ao início';
      }
    }
    if (!date) {
      newErrors.date = 'Data é obrigatória';
    }
    if (!timeStart) newErrors.timeStart = 'Hora início é obrigatória';
    if (!timeEnd) newErrors.timeEnd = 'Hora fim é obrigatória';
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
        timeStart,
        timeEnd,
        routeType,
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
      {!initialData && (
        <View style={[styles.infoBanner, { backgroundColor: colors.surfaceSecondary }]}>
          <Feather name="info" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoBannerText, { color: colors.textSecondary }]}>
            Registre uma entrada por dia com todos os seus ganhos
          </Text>
        </View>
      )}

      <Input
        label="Valor (R$)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0,00"
        error={errors.amount}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Plataforma</Text>
      <View style={styles.chipRow}>
        {PLATFORMS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setPlatform(p.id)}
            style={[
              styles.chip,
              {
                backgroundColor: platform === p.id ? colors.primary : colors.surfaceSecondary,
                borderColor: platform === p.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
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

      <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo de trajeto</Text>
      <View style={styles.chipRow}>
        {ROUTE_TYPES.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => setRouteType(r.id)}
            style={[
              styles.chip,
              {
                backgroundColor: routeType === r.id ? colors.primary : colors.surfaceSecondary,
                borderColor: routeType === r.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: routeType === r.id ? colors.primaryText : colors.text },
              ]}
            >
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Input
            label="Odômetro início (km)"
            value={odoStart}
            onChangeText={setOdoStart}
            keyboardType="numeric"
            placeholder=""
            error={errors.odoStart}
          />
        </View>
        <View style={styles.halfField}>
          <Input
            label="Odômetro fim (km)"
            value={odoEnd}
            onChangeText={setOdoEnd}
            keyboardType="numeric"
            placeholder=""
            error={errors.odoEnd}
          />
        </View>
      </View>

      <DatePickerField
        label="Data"
        value={date}
        onChange={handleDateChange}
        error={errors.date ?? dateError}
      />

      <View style={styles.row}>
        <View style={styles.halfField}>
          <TimePickerField
            label="Hora início"
            value={timeStart}
            onChange={setTimeStart}
            error={errors.timeStart}
          />
        </View>
        <View style={styles.halfField}>
          <TimePickerField
            label="Hora fim"
            value={timeEnd}
            onChange={setTimeEnd}
            error={errors.timeEnd}
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  infoBannerText: { fontSize: fontSize.sm, flex: 1 },
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
  row: { flexDirection: 'row', gap: spacing.sm },
  halfField: { flex: 1 },
  submitArea: { marginTop: spacing.lg },
});
