import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useLiveCustomCategories } from '../../hooks/useLiveCustomCategories';
import { insertCustomCategory, deleteCustomCategory } from '../../db/queries/categories';
import { DEFAULT_EXPENSE_CATEGORIES } from '../../constants/categories';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useThemeColors, spacing, fontSize, borderRadius } from '../../theme';

export function CategoryManager() {
  const colors = useThemeColors();
  const { data: customCats } = useLiveCustomCategories();
  const [newName, setNewName] = useState('');

  async function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const allNames = [
      ...DEFAULT_EXPENSE_CATEGORIES.map((c) => c.label.toLowerCase()),
      ...customCats.map((c) => c.name.toLowerCase()),
    ];
    if (allNames.includes(trimmed.toLowerCase())) {
      Alert.alert('Erro', 'Essa categoria ja existe.');
      return;
    }

    await insertCustomCategory(trimmed);
    setNewName('');
  }

  function handleDelete(id: string, name: string) {
    Alert.alert('Excluir categoria', `Remover "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteCustomCategory(id),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Categorias personalizadas</Text>

      {customCats.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Nenhuma categoria personalizada criada.
        </Text>
      ) : (
        <View style={styles.list}>
          {customCats.map((cat) => (
            <View
              key={cat.id}
              style={[styles.catRow, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
              <Pressable onPress={() => handleDelete(cat.id, cat.name)}>
                <Text style={[styles.deleteBtn, { color: colors.negative }]}>Excluir</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={styles.addRow}>
        <View style={styles.addInput}>
          <Input
            label="Nova categoria"
            value={newName}
            onChangeText={setNewName}
            placeholder="Ex: Pedagio"
          />
        </View>
        <View style={styles.addBtn}>
          <Button title="Adicionar" onPress={handleAdd} disabled={newName.trim() === ''} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', marginBottom: spacing.sm },
  emptyText: { fontSize: fontSize.sm, marginBottom: spacing.md },
  list: { marginBottom: spacing.md },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  catName: { fontSize: fontSize.md },
  deleteBtn: { fontSize: fontSize.sm, fontWeight: '600' },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  addInput: { flex: 1 },
  addBtn: { marginBottom: spacing.md },
});
