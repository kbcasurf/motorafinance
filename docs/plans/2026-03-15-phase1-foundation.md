# Phase 1: Foundation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** A running Expo app with project structure, DB initialized, theme system, and navigation shell — ready for feature development.

**Architecture:** Expo SDK 55 with file-based routing (Expo Router v4). SQLite via expo-sqlite + Drizzle ORM for type-safe local storage. Zustand for UI state. Theme system with light/dark support via `useColorScheme`.

**Tech Stack:** React Native 0.83, Expo SDK 55, TypeScript strict, Drizzle ORM, expo-sqlite, Expo Router v4, Zustand 5.x, date-fns 4.x

---

### Task 1: Scaffold Expo project

**Files:**
- Create: entire project directory via `create-expo-app`

**Step 1: Create project**

```bash
cd /home/paschoal/Documents/repos/driver_finance
npx create-expo-app@latest driverfinance --template blank-typescript
```

**Step 2: Move files up**

The PRD expects the project at the `driver_finance` root. Move everything from `driverfinance/` up:

```bash
# Move all files (including hidden) from driverfinance/ to driver_finance/
shopt -s dotglob
mv driverfinance/* .
rmdir driverfinance
```

**Step 3: Verify it runs**

```bash
npx expo start --no-dev --minify 2>&1 | head -20
# Expected: Metro bundler starts without errors
```

**Step 4: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Expo project with blank-typescript template"
```

---

### Task 2: Install dependencies

**Step 1: Install production dependencies**

```bash
npx expo install expo-sqlite expo-sharing expo-file-system expo-haptics
npm install zustand date-fns drizzle-orm victory-native @shopify/react-native-skia react-native-reanimated react-native-gesture-handler react-native-safe-area-context
```

**Step 2: Install Expo Router**

```bash
npx expo install expo-router expo-linking expo-constants
```

**Step 3: Install dev dependencies**

```bash
npm install -D drizzle-kit prettier
```

**Step 4: Verify no install errors**

```bash
npx tsc --noEmit 2>&1 | tail -5
# Expected: No critical errors (some config warnings are OK at this stage)
```

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: install all project dependencies"
```

---

### Task 3: Create config files

**Files:**
- Create: `CLAUDE.md`
- Create: `.claude/settings.json`
- Create: `.mcp.json`
- Create: `.prettierrc`
- Create: `drizzle.config.ts`
- Modify: `.gitignore`

**Step 1: Create CLAUDE.md**

Copy content from PRD section 4.1 verbatim.

**Step 2: Create `.claude/settings.json`**

Copy content from PRD section 4.2 verbatim.

**Step 3: Create `.mcp.json`**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "description": "Documentacao atualizada de bibliotecas via Context7"
    }
  }
}
```

**Step 4: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**Step 5: Create `drizzle.config.ts`**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
});
```

**Step 6: Update `.gitignore`**

Append these entries:

```gitignore
# Claude Code
.claude/settings.local.json
CLAUDE.local.md

# Secrets
.env
.env.*
*.p8
*.p12
*.pem
*.key
*.mobileprovision

# EAS / Expo
.expo/
dist/
```

**Step 7: Commit**

```bash
git add CLAUDE.md .claude/settings.json .mcp.json .prettierrc drizzle.config.ts .gitignore
git commit -m "chore: add project config files (CLAUDE.md, drizzle, prettier, MCP)"
```

---

### Task 4: Setup theme system

**Files:**
- Create: `src/theme/index.ts`

**Step 1: Create theme file**

```typescript
import { useColorScheme } from 'react-native';

const palette = {
  green500: '#22C55E',
  green600: '#16A34A',
  red500: '#EF4444',
  red600: '#DC2626',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
  black: '#000000',
};

const lightColors = {
  background: palette.gray50,
  surface: palette.white,
  surfaceSecondary: palette.gray100,
  text: palette.gray900,
  textSecondary: palette.gray500,
  textInverse: palette.white,
  border: palette.gray200,
  primary: palette.blue600,
  primaryText: palette.white,
  positive: palette.green600,
  negative: palette.red600,
  icon: palette.gray500,
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
};

const darkColors = {
  background: palette.gray900,
  surface: palette.gray800,
  surfaceSecondary: palette.gray700,
  text: palette.gray50,
  textSecondary: palette.gray400,
  textInverse: palette.gray900,
  border: palette.gray700,
  primary: palette.blue500,
  primaryText: palette.white,
  positive: palette.green500,
  negative: palette.red500,
  icon: palette.gray400,
  tabBar: palette.gray800,
  tabBarBorder: palette.gray700,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type ThemeColors = typeof lightColors;

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}
```

**Step 2: Commit**

```bash
git add src/theme/index.ts
git commit -m "feat: add theme system with light/dark support"
```

---

### Task 5: Setup DB layer

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/client.ts`

**Step 1: Create schema**

Use the exact schema from PRD section 3.3 (income, expenses, customCategories, settings tables). All monetary values as INTEGER (centavos).

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const income = sqliteTable('income', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  platform: text('platform').notNull(),
  platformCustom: text('platform_custom'),
  odoStart: integer('odo_start'),
  odoEnd: integer('odo_end'),
  date: text('date').notNull(),
  time: text('time'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  odoReading: integer('odo_reading'),
  date: text('date').notNull(),
  fuelType: text('fuel_type'),
  fuelLiters: integer('fuel_liters'),
  fuelPricePerLiter: integer('fuel_price_per_liter'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const customCategories = sqliteTable('custom_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
```

**Step 2: Create DB client**

```typescript
// src/db/client.ts
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('driverfinance.db', {
  enableChangeListener: true,
});

export const db = drizzle(expo, { schema });
```

**Step 3: Commit**

```bash
git add src/db/
git commit -m "feat: add Drizzle ORM schema and DB client for expo-sqlite"
```

---

### Task 6: Generate first migration

**Step 1: Generate migration**

```bash
npx drizzle-kit generate
```

Expected: Creates SQL migration file in `drizzle/migrations/`.

**Step 2: Verify migration files exist**

```bash
ls drizzle/migrations/
# Expected: 0000_*.sql and meta/ directory
```

**Step 3: Commit**

```bash
git add drizzle/
git commit -m "chore: generate initial DB migration via drizzle-kit"
```

---

### Task 7: Create navigation shell

**Files:**
- Create: `app/_layout.tsx` (root layout with migration gate)
- Create: `app/(tabs)/_layout.tsx` (tab layout)
- Create: `app/(tabs)/index.tsx` (Dashboard placeholder)
- Create: `app/(tabs)/(income)/_layout.tsx` (income stack)
- Create: `app/(tabs)/(income)/index.tsx` (income list placeholder)
- Create: `app/(tabs)/(expenses)/_layout.tsx` (expenses stack)
- Create: `app/(tabs)/(expenses)/index.tsx` (expenses list placeholder)
- Create: `app/(tabs)/settings.tsx` (settings placeholder)

**Step 1: Create root layout with migration gate**

The root `_layout.tsx` must run Drizzle migrations before rendering the app. Use `useMigrations` hook.

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';

const expo = openDatabaseSync('driverfinance.db', {
  enableChangeListener: true,
});

export const db = drizzle(expo);

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao inicializar banco de dados</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  error: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },
  errorDetail: { marginTop: 8, fontSize: 14, color: '#6B7280' },
});
```

**Step 2: Create tab layout**

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="(income)" options={{ title: 'Receitas' }} />
      <Tabs.Screen name="(expenses)" options={{ title: 'Despesas' }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes' }} />
    </Tabs>
  );
}
```

**Step 3: Create placeholder screens**

Each placeholder screen shows a centered title text. Create:
- `app/(tabs)/index.tsx` — "Dashboard"
- `app/(tabs)/(income)/_layout.tsx` — Stack layout
- `app/(tabs)/(income)/index.tsx` — "Receitas"
- `app/(tabs)/(expenses)/_layout.tsx` — Stack layout
- `app/(tabs)/(expenses)/index.tsx` — "Despesas"
- `app/(tabs)/settings.tsx` — "Ajustes"

Income/Expenses stack layouts:

```typescript
import { Stack } from 'expo-router';

export default function IncomeLayout() {
  return <Stack />;
}
```

Placeholder screen pattern:

```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function ScreenName() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen Title</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
```

**Step 4: Remove old App.tsx if it exists**

The Expo Router uses `app/` directory — delete the default `App.tsx`.

**Step 5: Commit**

```bash
git add app/ && git rm App.tsx 2>/dev/null; true
git commit -m "feat: add navigation shell with tabs (Dashboard, Receitas, Despesas, Ajustes)"
```

---

### Task 8: Create base UI components

**Files:**
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`

**Step 1: Create Card component**

A themed surface card with shadow/elevation:

```typescript
// src/components/ui/Card.tsx
import { View, StyleSheet, ViewProps } from 'react-native';
import { useThemeColors, spacing, borderRadius } from '../../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
```

**Step 2: Create Button component**

Primary and outline variants:

```typescript
// src/components/ui/Button.tsx
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColors, spacing, borderRadius, fontSize } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const colors = useThemeColors();

  const containerStyle: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: disabled ? colors.border : colors.primary }
      : { borderWidth: 1, borderColor: colors.border };

  const textStyle: TextStyle =
    variant === 'primary'
      ? { color: colors.primaryText }
      : { color: colors.primary };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, containerStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
```

**Step 3: Create Input component**

Themed text input with label:

```typescript
// src/components/ui/Input.tsx
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColors, spacing, borderRadius, fontSize } from '../../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.negative : colors.border,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.negative }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: fontSize.sm, marginBottom: spacing.xs, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
  },
  error: { fontSize: fontSize.xs, marginTop: spacing.xs },
});
```

**Step 4: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add base UI components (Card, Button, Input)"
```

---

### Task 9: Create currency utility

**Files:**
- Create: `src/utils/currency.ts`
- Create: `src/utils/__tests__/currency.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/__tests__/currency.test.ts
import { formatCurrency, parseCurrencyToCents, centsToDecimal } from '../currency';

describe('currency utils', () => {
  describe('formatCurrency', () => {
    it('formats centavos to BRL string', () => {
      expect(formatCurrency(2550)).toBe('R$\u00a025,50');
    });

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('R$\u00a00,00');
    });

    it('formats large values', () => {
      expect(formatCurrency(1500000)).toBe('R$\u00a015.000,00');
    });
  });

  describe('parseCurrencyToCents', () => {
    it('parses decimal string to centavos', () => {
      expect(parseCurrencyToCents('25.50')).toBe(2550);
    });

    it('parses integer string', () => {
      expect(parseCurrencyToCents('100')).toBe(10000);
    });

    it('returns 0 for empty string', () => {
      expect(parseCurrencyToCents('')).toBe(0);
    });

    it('returns 0 for invalid input', () => {
      expect(parseCurrencyToCents('abc')).toBe(0);
    });
  });

  describe('centsToDecimal', () => {
    it('converts centavos to decimal number', () => {
      expect(centsToDecimal(2550)).toBe(25.5);
    });

    it('converts zero', () => {
      expect(centsToDecimal(0)).toBe(0);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npx jest src/utils/__tests__/currency.test.ts --passWithNoTests
# Expected: FAIL — module not found
```

**Step 3: Implement currency utils**

```typescript
// src/utils/currency.ts
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(cents: number): string {
  return formatter.format(cents / 100);
}

export function parseCurrencyToCents(value: string): number {
  if (!value || value.trim() === '') return 0;
  const parsed = parseFloat(value.replace(',', '.'));
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function centsToDecimal(cents: number): number {
  return cents / 100;
}
```

**Step 4: Run tests to verify they pass**

```bash
npx jest src/utils/__tests__/currency.test.ts
# Expected: PASS — all 7 tests pass
```

**Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add currency utils (formatCurrency, parseCurrencyToCents, centsToDecimal)"
```

---

### Task 10: Create expense categories constants

**Files:**
- Create: `src/constants/categories.ts`

**Step 1: Create categories file**

```typescript
// src/constants/categories.ts
export interface ExpenseCategory {
  id: string;
  label: string;
}

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'fuel', label: 'Abastecimento' },
  { id: 'washing', label: 'Lavagem/Higienizacao' },
  { id: 'accessories', label: 'Acessorios/Equipamentos' },
  { id: 'internet', label: 'Plano de Internet Movel' },
  { id: 'preventive_maintenance', label: 'Manutencao Preventiva' },
  { id: 'corrective_maintenance', label: 'Manutencao Corretiva' },
  { id: 'insurance', label: 'Seguro do Veiculo' },
  { id: 'tax', label: 'IPVA/Licenciamento' },
  { id: 'depreciation', label: 'Depreciacao' },
  { id: 'other', label: 'Outros' },
];

export const PLATFORMS = [
  { id: 'uber', label: 'Uber' },
  { id: '99', label: '99' },
  { id: 'indrive', label: 'InDrive' },
  { id: 'cabify', label: 'Cabify' },
  { id: 'other', label: 'Outro' },
] as const;

export const FUEL_TYPES = [
  { id: 'gasoline', label: 'Gasolina' },
  { id: 'ethanol', label: 'Etanol' },
  { id: 'gnv', label: 'GNV' },
  { id: 'diesel', label: 'Diesel' },
] as const;
```

**Step 2: Commit**

```bash
git add src/constants/
git commit -m "feat: add expense categories, platforms, and fuel type constants"
```

---

### Task 11: Configure Expo Router entry point

**Step 1: Update package.json**

Ensure `"main"` points to `expo-router/entry`:

```json
{
  "main": "expo-router/entry"
}
```

**Step 2: Update app.json**

Add the `scheme` for Expo Router:

```json
{
  "expo": {
    "scheme": "driverfinance"
  }
}
```

**Step 3: Verify the app compiles**

```bash
npx expo start --no-dev --minify 2>&1 | head -20
# Expected: Metro bundler starts
```

**Step 4: Commit**

```bash
git add package.json app.json
git commit -m "chore: configure Expo Router entry point and scheme"
```
