import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLiveExtras } from '../../../src/hooks/useLiveExtras';
import { deleteExtra } from '../../../src/db/queries/extras';
import { SwipeableRow } from '../../../src/components/ui/SwipeableRow';
import { Card } from '../../../src/components/ui/Card';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../../src/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePeriodFilter } from '../../../src/hooks/usePeriodFilter';

export default function ExtrasListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { startDate, endDate } = usePeriodFilter();
  const { data: extrasList } = useLiveExtras(startDate, endDate);

  function getRouteTypeLabel(routeType: string): string {
    return routeType === 'highway' ? 'Em viagem' : 'Urbano';
  }

  function getRouteTypeColor(routeType: string): string {
    return routeType === 'highway' ? colors.positive : colors.primary;
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={extrasList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={[styles.infoBox, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>O que registrar aqui?</Text>
            <Text style={[styles.infoBody, { color: colors.textSecondary }]}>
              Registre deslocamentos pessoais com o veículo de trabalho — compras, passeios, compromissos particulares. Esses km são descontados do cálculo de combustível, garantindo que só o custo profissional impacte seu lucro.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum deslocamento recreativo registrado neste mês
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const kmDriven = item.odoEnd - item.odoStart;
          const dateLabel = format(parseISO(item.date), "dd MMM", { locale: ptBR });

          return (
            <SwipeableRow onDelete={() => deleteExtra(item.id)}>
              <Pressable onPress={() => router.push(`/(extras)/${item.id}`)}>
                <Card style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text style={[styles.cardKm, { color: colors.text }]}>
                        {kmDriven} km
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: getRouteTypeColor(item.routeType) + '22' },
                        ]}
                      >
                        <Text
                          style={[styles.badgeText, { color: getRouteTypeColor(item.routeType) }]}
                        >
                          {getRouteTypeLabel(item.routeType)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                      {dateLabel}
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
        onPress={() => router.push('/(extras)/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.sm },
  card: { marginBottom: spacing.sm },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1, gap: spacing.xs },
  cardKm: { fontSize: fontSize.lg, fontWeight: '600' },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: '600' },
  cardDate: { fontSize: fontSize.sm, textAlign: 'right' },
  infoBox: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoTitle: { fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs },
  infoBody: { fontSize: fontSize.sm, lineHeight: 20 },
  empty: { alignItems: 'center', marginTop: spacing.xxl, padding: spacing.lg },
  emptyText: { fontSize: fontSize.md, textAlign: 'center' },
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
