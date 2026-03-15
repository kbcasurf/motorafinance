import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useLiveExpenses } from '../../../src/hooks/useLiveExpenses';
import { deleteExpense } from '../../../src/db/queries/expenses';
import { formatCurrency } from '../../../src/utils/currency';
import { SwipeableRow } from '../../../src/components/ui/SwipeableRow';
import { Card } from '../../../src/components/ui/Card';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../../src/theme';
import { DEFAULT_EXPENSE_CATEGORIES } from '../../../src/constants/categories';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ExpenseListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const now = new Date();
  const startDate = format(startOfMonth(now), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(now), 'yyyy-MM-dd');
  const { data: expenses } = useLiveExpenses(startDate, endDate);

  const total = expenses.reduce((sum, row) => sum + row.amount, 0);

  function getCategoryLabel(categoryId: string): string {
    return (
      DEFAULT_EXPENSE_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId
    );
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      >
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>Total do mes</Text>
        <Text style={[styles.headerTotal, { color: colors.negative }]}>
          {formatCurrency(total)}
        </Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma despesa registrada neste mes.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              Toque em + para registrar uma despesa.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SwipeableRow onDelete={() => deleteExpense(item.id)}>
            <Pressable onPress={() => router.push(`/(expenses)/${item.id}`)}>
              <Card style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.cardLeft}>
                    <Text style={[styles.cardAmount, { color: colors.text }]}>
                      {formatCurrency(item.amount)}
                    </Text>
                    <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                      {getCategoryLabel(item.category)}
                      {item.description ? ` · ${item.description}` : ''}
                    </Text>
                  </View>
                  <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                    {item.date}
                  </Text>
                </View>
              </Card>
            </Pressable>
          </SwipeableRow>
        )}
      />

      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(expenses)/new')}
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
