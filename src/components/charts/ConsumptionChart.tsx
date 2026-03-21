// src/components/charts/ConsumptionChart.tsx
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, BarGroup } from 'victory-native';
import { useThemeColors, spacing, fontSize } from '../../theme';

interface ConsumptionChartProps {
  urbanKmL: number | null;
  highwayKmL: number | null;
}

interface ChartDatum extends Record<string, unknown> {
  x: number;
  urban: number;
  highway: number;
}

export function ConsumptionChart({ urbanKmL, highwayKmL }: ConsumptionChartProps) {
  const colors = useThemeColors();

  if (urbanKmL === null && highwayKmL === null) return null;

  const data: ChartDatum[] = [
    { x: 1, urban: urbanKmL ?? 0, highway: highwayKmL ?? 0 },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        Consumo médio real (km/L)
      </Text>
      <View style={styles.chartWrapper}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={['urban', 'highway']}
          domain={{ y: [0] }}
          domainPadding={{ left: 60, right: 60, top: 20 }}
        >
          {({ points, chartBounds }) => (
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={0.3}
              withinGroupPadding={0.1}
            >
              <BarGroup.Bar
                points={points.urban}
                color={colors.primary}
                animate={{ type: 'timing' }}
              />
              <BarGroup.Bar
                points={points.highway}
                color={colors.positive}
                animate={{ type: 'timing' }}
              />
            </BarGroup>
          )}
        </CartesianChart>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Urbano{urbanKmL !== null ? ` (${urbanKmL.toFixed(1)} km/L)` : ''}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.positive }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Estrada{highwayKmL !== null ? ` (${highwayKmL.toFixed(1)} km/L)` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  title: { fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.sm },
  chartWrapper: { height: 220 },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: fontSize.xs },
});
