import { useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLiveIncomes } from '../../../src/hooks/useLiveIncomes';
import { deleteIncome } from '../../../src/db/queries/income';
import { formatCurrency } from '../../../src/utils/currency';
import { SwipeableRow } from '../../../src/components/ui/SwipeableRow';
import { Card } from '../../../src/components/ui/Card';
import { useThemeColors, spacing, typography } from '../../../src/theme';
import { PLATFORMS } from '../../../src/constants/categories';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useInitIncomeDefaults } from '../../../src/hooks/useInitIncomeDefaults';
import { usePeriodFilter } from '../../../src/hooks/usePeriodFilter';

export default function IncomeListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { startDate, endDate, label } = usePeriodFilter();
  const { data: incomes } = useLiveIncomes(startDate, endDate);

  useInitIncomeDefaults();

  const total = useMemo(() => incomes.reduce((sum, row) => sum + row.amount, 0), [incomes]);

  function getPlatformLabel(platformId: string): string {
    return PLATFORMS.find((p) => p.id === platformId)?.label ?? platformId;
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>
          Total: {label}
        </Text>
        <Text style={[styles.headerTotal, { color: colors.positive }]}>
          {formatCurrency(total)}
        </Text>
      </View>

      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={[styles.infoBox, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>O que registrar aqui?</Text>
            <Text style={[styles.infoBody, { color: colors.textSecondary }]}>
              Registre seus ganhos diários com plataformas como Chama27, Uber e 99. Um registro por dia, consolidando todos os ganhos do dia — valor recebido, quilometragem rodada e horários de trabalho.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma receita registrada neste mês.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              Toque em + para adicionar seu faturamento do dia. Você pode registrar ganhos de diferentes plataformas e acompanhar seu progresso ao longo do mês.
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {'\n'}Recomenda-se marcar o odômetro inicial do dia, o odômetro final e lançar uma única entrada com todos os ganhos diários.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const kmDriven =
            item.odoStart != null && item.odoEnd != null
              ? item.odoEnd - item.odoStart
              : null;

          return (
            <SwipeableRow onDelete={() => deleteIncome(item.id)} description="esta receita">
              <Pressable onPress={() => router.push(`/(income)/${item.id}`)}>
                <Card style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text style={[styles.cardAmount, { color: colors.text }]}>
                        {formatCurrency(item.amount)}
                      </Text>
                      <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                        {getPlatformLabel(item.platform)}
                        {kmDriven != null ? ` · ${kmDriven} km` : ''}
                      </Text>
                    </View>
                    <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                      {item.date}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            </SwipeableRow>
          );
        }}
      />

      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(income)/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerLabel: { fontSize: typography.caption.fontSize },
  headerTotal: { fontSize: typography.h2.fontSize, fontWeight: '700', marginTop: spacing.xs },
  list: { padding: spacing.sm },
  card: { marginBottom: spacing.sm },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1 },
  cardAmount: { fontSize: typography.h3.fontSize, fontWeight: '700' },
  cardMeta: { fontSize: typography.body.fontSize, marginTop: 2 },
  cardDate: { fontSize: typography.caption.fontSize, textAlign: 'right' },
  empty: { alignItems: 'center', marginTop: spacing.xxl, padding: spacing.lg },
  emptyText: { fontSize: typography.body.fontSize, textAlign: 'center' },
  emptyHint: { fontSize: typography.caption.fontSize, textAlign: 'center', marginTop: spacing.sm },
  infoBox: { borderRadius: 20, padding: spacing.lg, marginBottom: spacing.sm },
  infoTitle: { fontSize: typography.body.fontSize, fontWeight: '600', marginBottom: spacing.xs },
  infoBody: { fontSize: typography.body.fontSize, lineHeight: 20 },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: { color: '#FFFFFF', fontSize: 28, fontWeight: '300', marginTop: -2 },
});
