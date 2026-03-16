import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, Switch } from 'react-native';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { CategoryManager } from '../../src/components/settings/CategoryManager';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { exportAndShareCsv } from '../../src/utils/export';
import { parseCurrencyToCents, centsToDecimal } from '../../src/utils/currency';
import { wipeAllData } from '../../src/db/queries/wipe';
import { db } from '../../src/db/client';
import { income, expenses } from '../../src/db/schema';
import { between } from 'drizzle-orm';
import { useThemeColors, spacing, fontSize } from '../../src/theme';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const {
    darkTheme,
    driverName,
    vehicleModel,
    monthlyGoal,
    hydrated,
    hydrate,
    updateSetting,
  } = useSettingsStore();

  const [nameInput, setNameInput] = useState('');
  const [vehicleInput, setVehicleInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  }, [hydrated, hydrate]);

  useEffect(() => {
    if (hydrated) {
      setNameInput(driverName);
      setVehicleInput(vehicleModel);
      setGoalInput(monthlyGoal ? centsToDecimal(parseInt(monthlyGoal, 10)).toString() : '');
    }
  }, [hydrated, driverName, vehicleModel, monthlyGoal]);

  function handleSaveName() {
    updateSetting('driver_name', nameInput.trim());
  }

  function handleSaveVehicle() {
    updateSetting('vehicle_model', vehicleInput.trim());
  }

  function handleSaveGoal() {
    const cents = parseCurrencyToCents(goalInput);
    updateSetting('monthly_goal', cents.toString());
  }

  async function handleExport() {
    setExporting(true);
    try {
      const now = new Date();
      const startDate = format(startOfMonth(now), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(now), 'yyyy-MM-dd');

      const incomeRows = await db
        .select()
        .from(income)
        .where(between(income.date, startDate, endDate));
      const expenseRows = await db
        .select()
        .from(expenses)
        .where(between(expenses.date, startDate, endDate));

      await exportAndShareCsv(
        incomeRows,
        expenseRows,
        format(now, 'yyyy-MM'),
      );
    } catch {
      Alert.alert('Erro', 'Nao foi possivel exportar os dados.');
    } finally {
      setExporting(false);
    }
  }

  function handleWipe() {
    Alert.alert(
      'Limpar todos os dados',
      'Tem certeza? Esta acao nao pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmacao final',
              'TODOS os dados serao apagados permanentemente. Confirmar?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Apagar tudo',
                  style: 'destructive',
                  onPress: async () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    await wipeAllData();
                    await hydrate();
                    setNameInput('');
                    setVehicleInput('');
                    setGoalInput('');
                    Alert.alert('Dados apagados', 'Todos os registros foram removidos.');
                  },
                },
              ],
            );
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
      <Card>
        <View style={styles.themeRow}>
          <Text style={[styles.themeLabel, { color: colors.text }]}>Tema escuro</Text>
          <Switch
            value={darkTheme}
            onValueChange={(v) => updateSetting('dark_theme', String(v))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>Perfil</Text>
      <Card>
        <Input
          label="Nome do motorista"
          value={nameInput}
          onChangeText={setNameInput}
          onBlur={handleSaveName}
          placeholder="Seu nome"
        />
        <Input
          label="Modelo do veiculo"
          value={vehicleInput}
          onChangeText={setVehicleInput}
          onBlur={handleSaveVehicle}
          placeholder="Ex: Honda Civic 2020"
        />
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>
        Meta mensal
      </Text>
      <Card>
        <Input
          label="Meta de lucro liquido (R$)"
          value={goalInput}
          onChangeText={setGoalInput}
          onBlur={handleSaveGoal}
          keyboardType="decimal-pad"
          placeholder="Ex: 5000"
        />
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>
        Exportar dados
      </Text>
      <Card>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Exporta receitas e despesas do mes atual em formato CSV.
        </Text>
        <Button
          title={exporting ? 'Exportando...' : 'Exportar CSV do mes'}
          onPress={handleExport}
          disabled={exporting}
        />
      </Card>

      <CategoryManager />

      <View style={styles.dangerZone}>
        <Text style={[styles.sectionTitle, { color: colors.negative }]}>Zona de perigo</Text>
        <Card>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Remove todas as receitas, despesas, categorias e configuracoes. Esta acao e irreversivel.
          </Text>
          <Button title="Limpar todos os dados" onPress={handleWipe} variant="outline" />
        </Card>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', marginBottom: spacing.sm },
  description: { fontSize: fontSize.sm, marginBottom: spacing.md },
  dangerZone: { marginTop: spacing.xl },
  bottomSpacer: { height: spacing.xxl },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeLabel: { fontSize: fontSize.md },
});
