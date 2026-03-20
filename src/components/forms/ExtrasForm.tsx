import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DatePickerField, TimePickerField } from '../ui/DatePickerField';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../theme';
import type { Extra, NewExtra } from '../../db/queries/extras';

const ROUTE_TYPES = [
  { id: 'urban' as const, label: 'Urbano' },
  { id: 'highway' as const, label: 'Em viagem' },
];

interface ExtrasFormProps {
  initialData?: Extra;
  onSubmit: (data: NewExtra) => Promise<void>;
  submitLabel: string;
}

export function ExtrasForm({ initialData, onSubmit, submitLabel }: ExtrasFormProps) {
  const colors = useThemeColors();
  const now = new Date();

  const [odoStart, setOdoStart] = useState(initialData?.odoStart?.toString() ?? '');
  const [odoEnd, setOdoEnd] = useState(initialData?.odoEnd?.toString() ?? '');
  const [date, setDate] = useState(initialData?.date ?? format(now, 'yyyy-MM-dd'));
  const [timeStart, setTimeStart] = useState(initialData?.timeStart ?? format(now, 'HH:mm'));
  const [timeEnd, setTimeEnd] = useState(initialData?.timeEnd ?? format(now, 'HH:mm'));
  const [routeType, setRouteType] = useState<'urban' | 'highway'>(
    (initialData?.routeType as 'urban' | 'highway') ?? 'urban',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warning, setWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!odoStart.trim()) {
      newErrors.odoStart = 'Odômetro início é obrigatório';
    }
    if (!odoEnd.trim()) {
      newErrors.odoEnd = 'Odômetro fim é obrigatório';
    }
    if (odoStart.trim() && odoEnd.trim()) {
      const start = parseInt(odoStart, 10);
      const end = parseInt(odoEnd, 10);
      if (!isNaN(start) && !isNaN(end) && end < start) {
        newErrors.odoEnd = 'Odômetro fim deve ser maior ou igual ao início';
      }
    }
    if (!date) {
      newErrors.date = 'Data é obrigatória';
    }
    if (!timeStart) {
      newErrors.timeStart = 'Hora início é obrigatória';
    }
    if (!timeEnd) {
      newErrors.timeEnd = 'Hora fim é obrigatória';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return false;

    if (timeStart && timeEnd && timeEnd <= timeStart) {
      setWarning('Hora fim anterior à hora início — verifique se a viagem cruzou meia-noite.');
    } else {
      setWarning('');
    }

    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        odoStart: parseInt(odoStart, 10),
        odoEnd: parseInt(odoEnd, 10),
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
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Input
            label="Odômetro início (km)"
            value={odoStart}
            onChangeText={setOdoStart}
            keyboardType="numeric"
            placeholder="0"
            error={errors.odoStart}
          />
        </View>
        <View style={styles.halfField}>
          <Input
            label="Odômetro fim (km)"
            value={odoEnd}
            onChangeText={setOdoEnd}
            keyboardType="numeric"
            placeholder="0"
            error={errors.odoEnd}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <TimePickerField label="Hora início" value={timeStart} onChange={setTimeStart} />
          {errors.timeStart ? (
            <Text style={[styles.fieldError, { color: colors.negative }]}>{errors.timeStart}</Text>
          ) : null}
        </View>
        <View style={styles.halfField}>
          <TimePickerField label="Hora fim" value={timeEnd} onChange={setTimeEnd} />
          {errors.timeEnd ? (
            <Text style={[styles.fieldError, { color: colors.negative }]}>{errors.timeEnd}</Text>
          ) : null}
        </View>
      </View>

      <DatePickerField label="Data" value={date} onChange={setDate} error={errors.date} />

      {warning ? (
        <Text style={[styles.warning, { color: colors.negative }]}>{warning}</Text>
      ) : null}

      <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo de rota</Text>
      <View style={styles.chipRow}>
        {ROUTE_TYPES.map((rt) => (
          <Pressable
            key={rt.id}
            onPress={() => setRouteType(rt.id)}
            style={[
              styles.chip,
              {
                backgroundColor: routeType === rt.id ? colors.primary : colors.surfaceSecondary,
                borderColor: routeType === rt.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: routeType === rt.id ? colors.primaryText : colors.text },
              ]}
            >
              {rt.label}
            </Text>
          </Pressable>
        ))}
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
  row: { flexDirection: 'row', gap: spacing.sm },
  halfField: { flex: 1 },
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
  warning: { fontSize: fontSize.sm, marginBottom: spacing.sm },
  fieldError: { fontSize: fontSize.xs, marginTop: 2, marginBottom: spacing.xs },
  submitArea: { marginTop: spacing.lg },
});
