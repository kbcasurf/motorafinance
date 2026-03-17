import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useLiveIncomes } from '../../../src/hooks/useLiveIncomes';
import { deleteIncome } from '../../../src/db/queries/income';
import { formatCurrency } from '../../../src/utils/currency';
import { SwipeableRow } from '../../../src/components/ui/SwipeableRow';
import { Card } from '../../../src/components/ui/Card';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../../src/theme';
import { PLATFORMS } from '../../../src/constants/categories';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useInitIncomeDefaults } from '../../../src/hooks/useInitIncomeDefaults';

export default function IncomeListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const now = new Date();
  const startDate = format(startOfMonth(now), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(now), 'yyyy-MM-dd');
  const { data: incomes } = useLiveIncomes(startDate, endDate);

  useInitIncomeDefaults();

  const total = incomes.reduce((sum, row) => sum + row.amount, 0);

  function getPlatformLabel(platformId: string): string {
    return PLATFORMS.find((p) => p.id === platformId)?.label ?? platformId;
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>
          Total do mês
        </Text>
        <Text style={[styles.headerTotal, { color: colors.positive }]}>
          {formatCurrency(total)}
        </Text>
      </View>

      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma receita registrada neste mês.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              Toque em + para adicionar seu faturamento do dia. Você pode registrar ganhos de diferentes plataformas e acompanhar seu progresso ao longo do mês.
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Recomenda-se marcar o odômetro inicial do dia, o odômetro final e lançar uma única entrada com todos os ganhos diários.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const kmDriven =
            item.odoStart != null && item.odoEnd != null
              ? item.odoEnd - item.odoStart
              : null;

          return (
            <SwipeableRow onDelete={() => deleteIncome(item.id)}>
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
                      {item.time ? `\n${item.time}` : ''}
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
  headerLabel: { fontSize: fontSize.sm },
  headerTotal: { fontSize: fontSize.xl, fontWeight: 'bold', marginTop: spacing.xs },
  list: { padding: spacing.sm },
  card: { marginBottom: spacing.sm },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1 },
  cardAmount: { fontSize: fontSize.lg, fontWeight: '600' },
  cardMeta: { fontSize: fontSize.sm, marginTop: 2 },
  cardDate: { fontSize: fontSize.xs, textAlign: 'right' },
  empty: { alignItems: 'center', marginTop: spacing.xxl, padding: spacing.lg },
  emptyText: { fontSize: fontSize.md, textAlign: 'center' },
  emptyHint: { fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
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
