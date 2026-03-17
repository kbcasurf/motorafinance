import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../theme';
import type { PeriodType } from '../../hooks/usePeriodFilter';

interface PeriodSelectorProps {
  periodType: PeriodType;
  onChangePeriodType: (type: PeriodType) => void;
  label: string;
  onPrevious: () => void;
  onNext: () => void;
}

const PERIOD_OPTIONS: { type: PeriodType; label: string }[] = [
  { type: 'day', label: 'Dia' },
  { type: 'week', label: 'Semana' },
  { type: 'month', label: 'Mês' },
];

export function PeriodSelector({
  periodType,
  onChangePeriodType,
  label,
  onPrevious,
  onNext,
}: PeriodSelectorProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        {PERIOD_OPTIONS.map((opt) => (
          <Pressable
            key={opt.type}
            onPress={() => onChangePeriodType(opt.type)}
            style={[
              styles.toggleBtn,
              {
                backgroundColor:
                  periodType === opt.type ? colors.primary : colors.surfaceSecondary,
                borderColor: periodType === opt.type ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: periodType === opt.type ? colors.primaryText : colors.text },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.navRow}>
        <Pressable onPress={onPrevious} style={styles.navBtn}>
          <Text style={[styles.navArrow, { color: colors.primary }]}>{'<'}</Text>
        </Pressable>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Pressable onPress={onNext} style={styles.navBtn}>
          <Text style={[styles.navArrow, { color: colors.primary }]}>{'>'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  toggleBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  toggleText: { fontSize: fontSize.sm, fontWeight: '600' },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    padding: spacing.sm,
  },
  navArrow: { fontSize: fontSize.xl, fontWeight: 'bold' },
  label: { fontSize: fontSize.md, fontWeight: '600', textTransform: 'capitalize' },
});
