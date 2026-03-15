# PRD — DriverFinance: Controle Financeiro para Motoristas de Aplicativo

**Versão:** 2.0.0
**Data:** Março 2026
**Status:** Draft
**Stack alvo:** React Native 0.83 (Expo SDK 55) · TypeScript · Drizzle ORM + SQLite local · GitHub Actions CI/CD

---

## 1. Visão Geral do Produto

### 1.1 Problema

Motoristas de aplicativos de mobilidade urbana (Uber, 99, InDrive, Cabify etc.) trabalham de forma autônoma e raramente têm visibilidade clara de quanto efetivamente lucram após descontar os custos operacionais. O resultado é uma percepção de receita distorcida que dificulta decisões financeiras e de jornada de trabalho.

### 1.2 Solução

**DriverFinance** é um aplicativo mobile (Android e iOS) focado exclusivamente no controle financeiro do motorista. Ele registra receitas por corrida, captura despesas operacionais por categoria, deduz automaticamente os custos das receitas e apresenta o **lucro líquido real** por dia, semana e mês — com acompanhamento de quilometragem pelo odômetro.

### 1.3 Público-alvo

Motoristas autônomos de aplicativos de transporte individual de passageiros no Brasil que querem controlar seus ganhos reais de forma simples, offline e sem necessidade de planilhas.

### 1.4 Referência de mercado

O módulo de controle financeiro do aplicativo **Rebu** (disponível na Google Play) é a principal referência de UX e funcionalidade. O presente produto replica apenas esse módulo, sem os demais recursos do Rebu.

---

## 2. Requisitos de Negócio

### 2.1 Requisitos Funcionais

#### RF-01 — Registro de Receitas

| ID | Requisito |
|----|-----------|
| RF-01.1 | O motorista deve poder registrar uma entrada de receita informando: valor bruto recebido, plataforma de origem (Uber, 99, InDrive, Cabify, Outro), data/hora, leitura do odômetro no início da corrida (km) e leitura do odômetro no fim da corrida (km). |
| RF-01.2 | O campo de plataforma deve ser selecionável em lista e permitir a opção "Outro" com campo de texto livre. |
| RF-01.3 | O sistema deve calcular automaticamente a quilometragem percorrida por corrida (km_fim − km_início) na camada de aplicação. |
| RF-01.4 | O sistema deve aceitar múltiplas entradas por dia. |
| RF-01.5 | O motorista deve poder editar ou excluir qualquer entrada de receita registrada. |
| RF-01.6 | Para entrada rápida, o formulário deve pré-preencher: data/hora atual, última plataforma utilizada e último odômetro fim como novo odômetro início. |

#### RF-02 — Registro de Despesas

| ID | Requisito |
|----|-----------|
| RF-02.1 | O motorista deve poder registrar despesas operacionais com os seguintes campos: valor, categoria, data, descrição opcional e leitura do odômetro (opcional). |
| RF-02.2 | As categorias de despesa devem incluir no mínimo: Abastecimento, Lavagem/Higienização, Acessórios/Equipamentos, Plano de Internet Móvel, Manutenção Preventiva, Manutenção Corretiva, Seguro do Veículo, IPVA/Licenciamento, Depreciação e Outros. |
| RF-02.3 | O motorista deve poder criar categorias personalizadas adicionais. |
| RF-02.4 | Para despesas da categoria "Abastecimento", deve haver campos opcionais: tipo de combustível (Gasolina, Etanol, GNV, Diesel), litros abastecidos e valor por litro — com cálculo automático do total. |
| RF-02.5 | O motorista deve poder editar ou excluir qualquer despesa registrada. |

#### RF-03 — Dashboard de Resultados

| ID | Requisito |
|----|-----------|
| RF-03.1 | O dashboard deve exibir, para o período selecionado: receita bruta total, total de despesas, **lucro líquido** (receita bruta − despesas) e quilometragem total percorrida. |
| RF-03.2 | O sistema deve suportar três granularidades de período: Diário (seleção por data), Semanal (seleção por semana ISO) e Mensal (seleção por mês/ano). |
| RF-03.3 | O lucro líquido deve ser exibido com destaque visual positivo (verde) quando positivo e negativo (vermelho) quando negativo. |
| RF-03.4 | O dashboard deve exibir um indicador de **custo por km** (total despesas ÷ km total) e **receita por km** (receita bruta ÷ km total) para o período. |
| RF-03.5 | Deve haver um gráfico de barras comparando receita bruta × despesas × lucro líquido ao longo dos dias do período selecionado (para visões semanal e mensal), renderizado com Victory Native XL (Skia). |

#### RF-04 — Histórico e Listas

| ID | Requisito |
|----|-----------|
| RF-04.1 | Deve existir uma tela de histórico de receitas com listagem cronológica reversa, filtro por plataforma e filtro por intervalo de datas. |
| RF-04.2 | Deve existir uma tela de histórico de despesas com listagem cronológica reversa, filtro por categoria e filtro por intervalo de datas. |
| RF-04.3 | Cada item da lista deve exibir valor, categoria/plataforma e data de forma compacta, com swipe-to-delete (via react-native-gesture-handler) para exclusão rápida. |

#### RF-05 — Relatório de Exportação

| ID | Requisito |
|----|-----------|
| RF-05.1 | O motorista deve poder exportar os dados do período selecionado em formato CSV com campos: data, tipo (receita/despesa), categoria/plataforma, valor, km_início, km_fim, km_percorrida, descrição. |
| RF-05.2 | O arquivo CSV deve ser compartilhável via share sheet nativa do sistema operacional. |

#### RF-06 — Configurações

| ID | Requisito |
|----|-----------|
| RF-06.1 | O motorista deve poder configurar seu nome e modelo do veículo (exibido no header). |
| RF-06.2 | Deve existir uma opção para limpar todos os dados com confirmação em duas etapas. |
| RF-06.3 | Deve existir configuração de meta de lucro líquido mensal, exibida como progresso percentual no dashboard. |

### 2.2 Requisitos Não-Funcionais

| ID | Requisito |
|----|-----------|
| RNF-01 | O aplicativo deve funcionar 100% offline. Todos os dados são armazenados localmente no dispositivo via SQLite (expo-sqlite + Drizzle ORM). |
| RNF-02 | O tempo de abertura do app (cold start) deve ser inferior a 2 segundos em dispositivos com Android 10+ e iOS 15+. |
| RNF-03 | O registro de uma entrada (receita ou despesa) deve ser concluído em no máximo 3 toques/ações, viabilizado por smart defaults (RF-01.6): data/hora atual pré-preenchida, última plataforma lembrada e odômetro continuado automaticamente. |
| RNF-04 | A interface deve ser acessível em português brasileiro (pt-BR) como idioma padrão único na v1.0. |
| RNF-05 | O aplicativo deve suportar modo claro e escuro seguindo as preferências do sistema operacional. |
| RNF-06 | Os dados devem ser preservados entre atualizações do aplicativo. |
| RNF-07 | Todos os valores monetários devem ser armazenados como INTEGER em centavos para evitar erros de ponto flutuante. A formatação para BRL ocorre apenas na camada de apresentação. |
| RNF-08 | O app deve implementar error boundaries em React para capturar falhas de renderização e exibir tela de fallback amigável ao invés de crash. |

### 2.3 Fora do Escopo (v1.0)

- Sincronização com nuvem ou multi-dispositivo
- Login/autenticação de usuário
- Integração com APIs das plataformas (Uber, 99 etc.)
- Relatórios em PDF
- Notificações push
- Múltiplos veículos/motoristas
- Funcionalidades além do controle financeiro (escala de horários, mapa de corridas etc.)

---

## 3. Arquitetura Técnica

### 3.1 Stack

```
React Native 0.83 (via Expo SDK 55)
TypeScript 5.x (strict mode)
Expo Router v4 (file-based routing + NativeTabs)
Expo SQLite + Drizzle ORM (armazenamento local type-safe)
Zustand 5.x (gerenciamento de estado)
Victory Native XL (gráficos Skia de alta performance)
  └── @shopify/react-native-skia
  └── react-native-reanimated 3.x
react-native-gesture-handler (swipe gestures)
date-fns 4.x (manipulação de datas)
expo-sharing (exportação CSV)
expo-file-system (manipulação de arquivos)
expo-haptics (feedback tátil)
drizzle-kit (CLI de migrações — dev dependency)
```

### 3.2 Estrutura de Pastas

```
driverfinance/
├── app/                           # Telas (Expo Router)
│   ├── _layout.tsx                # Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx            # Tab layout (NativeTabs)
│   │   ├── index.tsx              # Dashboard
│   │   ├── (income)/
│   │   │   ├── _layout.tsx        # Stack layout para receitas
│   │   │   ├── index.tsx          # Lista de receitas
│   │   │   ├── new.tsx            # Nova receita
│   │   │   └── [id].tsx           # Editar receita
│   │   ├── (expenses)/
│   │   │   ├── _layout.tsx        # Stack layout para despesas
│   │   │   ├── index.tsx          # Lista de despesas
│   │   │   ├── new.tsx            # Nova despesa
│   │   │   └── [id].tsx           # Editar despesa
│   │   └── settings.tsx           # Configurações
├── src/
│   ├── db/
│   │   ├── client.ts              # Instância expo-sqlite + Drizzle
│   │   ├── schema.ts              # Schema Drizzle ORM (TypeScript)
│   │   └── queries/
│   │       ├── income.ts          # Queries type-safe de receitas
│   │       ├── expenses.ts        # Queries type-safe de despesas
│   │       └── reports.ts         # Queries de agregação para dashboard
│   ├── stores/
│   │   ├── useIncomeStore.ts
│   │   ├── useExpenseStore.ts
│   │   └── useSettingsStore.ts
│   ├── hooks/                     # Custom hooks
│   │   ├── useLiveIncomes.ts      # Drizzle useLiveQuery wrapper
│   │   ├── useLiveExpenses.ts     # Drizzle useLiveQuery wrapper
│   │   └── usePeriodFilter.ts     # Lógica de filtro por período
│   ├── components/
│   │   ├── ui/                    # Componentes base (Button, Card, Input)
│   │   ├── charts/                # Gráficos Victory Native XL
│   │   └── forms/                 # Formulários de entrada
│   ├── utils/
│   │   ├── currency.ts            # Formatação monetária BRL (centavos → display)
│   │   ├── export.ts              # Geração de CSV
│   │   └── calculations.ts        # Cálculos financeiros
│   ├── theme/                     # Tema claro/escuro
│   │   └── index.ts               # Cores, espaçamentos, tipografia
│   └── constants/
│       └── categories.ts          # Categorias de despesa padrão
├── drizzle/                       # Migrações auto-geradas pelo drizzle-kit
│   └── migrations/
├── drizzle.config.ts              # Configuração do drizzle-kit
├── assets/
├── CLAUDE.md                      # Contexto para Claude Code CLI
├── .claude/
│   ├── settings.json              # Permissões e configurações (git-managed)
│   ├── settings.local.json        # Config pessoal (.gitignore)
│   └── commands/                  # Comandos customizados
│       ├── new-feature.md
│       ├── run-tests.md
│       └── db-migrate.md
├── .mcp.json                      # Configuração MCP (git-managed)
└── .github/
    └── workflows/
        ├── ci.yml                 # Lint + Testes
        └── build.yml              # Build EAS
```

### 3.3 Schema do Banco de Dados (Drizzle ORM)

O schema é definido em TypeScript usando Drizzle ORM, que gera as migrações SQL automaticamente via `drizzle-kit`.

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Receitas — valores em centavos (INTEGER)
export const income = sqliteTable('income', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),          // centavos (ex: R$ 25,50 = 2550)
  platform: text('platform').notNull(),         // 'uber' | '99' | 'indrive' | 'cabify' | 'other'
  platformCustom: text('platform_custom'),      // nome quando platform = 'other'
  odoStart: integer('odo_start'),               // km (inteiro)
  odoEnd: integer('odo_end'),                   // km (inteiro)
  date: text('date').notNull(),                 // ISO 8601 (YYYY-MM-DD)
  time: text('time'),                           // HH:mm
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Despesas — valores em centavos (INTEGER)
export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),          // centavos
  category: text('category').notNull(),
  description: text('description'),
  odoReading: integer('odo_reading'),           // km (inteiro)
  date: text('date').notNull(),                 // ISO 8601
  fuelType: text('fuel_type'),                  // 'gasoline' | 'ethanol' | 'gnv' | 'diesel'
  fuelLiters: integer('fuel_liters'),           // mililitros (para precisão sem float)
  fuelPricePerLiter: integer('fuel_price_per_liter'), // centavos por litro
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Categorias personalizadas
export const customCategories = sqliteTable('custom_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

// Configurações
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
```

**Inicialização do banco (src/db/client.ts):**

```typescript
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('driverfinance.db', {
  enableChangeListener: true, // habilita useLiveQuery reativo
});

export const db = drizzle(expo, { schema });
```

**Configuração do drizzle-kit (drizzle.config.ts):**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
});
```

**Notas sobre o schema:**
- `km_driven` (quilometragem percorrida) é calculado na camada de aplicação (`odoEnd - odoStart`), não como coluna gerada no SQLite, pois `GENERATED ALWAYS AS ... STORED` tem suporte inconsistente em mobile.
- Valores monetários em INTEGER (centavos) eliminam erros de ponto flutuante. A conversão `centavos ↔ display` é responsabilidade de `src/utils/currency.ts`.
- `fuel_liters` em mililitros e `fuel_price_per_liter` em centavos seguem o mesmo princípio.

### 3.4 Queries Reativas com Drizzle

O Drizzle ORM oferece `useLiveQuery` para atualização automática da UI quando os dados mudam:

```typescript
// src/hooks/useLiveIncomes.ts
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '../db/client';
import { income } from '../db/schema';
import { desc, between } from 'drizzle-orm';

export function useLiveIncomes(startDate: string, endDate: string) {
  return useLiveQuery(
    db.select()
      .from(income)
      .where(between(income.date, startDate, endDate))
      .orderBy(desc(income.date))
  );
}
```

Isso elimina a necessidade de sincronização manual entre Zustand stores e SQLite — a UI re-renderiza automaticamente quando dados são inseridos, atualizados ou deletados.

---

## 4. Configuração do Claude Code CLI

Esta seção detalha todos os arquivos necessários para obter o máximo de performance e segurança ao usar o Claude Code CLI durante o desenvolvimento do DriverFinance.

### 4.1 CLAUDE.md (Raiz do Projeto)

O arquivo `CLAUDE.md` é carregado automaticamente pelo Claude Code em toda sessão. Ele deve conter o contexto técnico do projeto, convenções de código e instruções de workflow. Coloque-o na raiz do repositório para que seja versionado e compartilhado com o time.

```markdown
# DriverFinance — Contexto para Claude Code

## O que é este projeto
Aplicativo React Native (Expo) para controle financeiro de motoristas de
aplicativos de mobilidade urbana. MVP focado exclusivamente em registro de
receitas, despesas e cálculo de lucro líquido.

## Stack principal
- React Native 0.83 + Expo SDK 55
- TypeScript strict mode (sem `any`)
- Expo SQLite + Drizzle ORM para armazenamento local type-safe
- Zustand 5.x para estado global
- Expo Router v4 para navegação (file-based + NativeTabs)
- Victory Native XL para gráficos (Skia + Reanimated)
- date-fns 4.x para manipulação de datas

## Convenções de código
- Idioma do código: inglês (variáveis, funções, comentários técnicos)
- Idioma da UI: português brasileiro (strings visíveis ao usuário)
- Formatação: Prettier (config em `.prettierrc`)
- Linting: ESLint com plugin React Native
- Componentes: sempre functional components + hooks
- Nomenclatura: PascalCase para componentes, camelCase para funções/variáveis
- Todos os valores monetários são armazenados como INTEGER (centavos) no SQLite e
  formatados como BRL com `src/utils/currency.ts` usando
  `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})`

## Banco de dados
- Schema Drizzle ORM em `src/db/schema.ts`
- Cliente em `src/db/client.ts`
- Toda query deve usar o Drizzle query builder (type-safe, sem SQL cru)
- Migrações auto-geradas pelo drizzle-kit em `drizzle/migrations/`
- Para gerar migração: `npx drizzle-kit generate`
- Para queries reativas, usar `useLiveQuery` do Drizzle

## Estrutura de arquivos
- Telas em `app/` (Expo Router file-based routing)
- Lógica de negócio em `src/`
- Componentes compartilhados em `src/components/`
- Custom hooks em `src/hooks/`
- Tema (cores, espaçamentos) em `src/theme/`
- Utilitários puros (sem side-effects) em `src/utils/`

## Comandos do projeto
- `npm run start` — Inicia o servidor Expo
- `npm run test` — Jest + React Native Testing Library
- `npm run lint` — ESLint
- `npm run type-check` — tsc --noEmit
- `npx drizzle-kit generate` — Gera migrações a partir do schema
- `npx eas build --platform android` — Build Android via EAS

## O que NÃO fazer
- Não usar `any` em TypeScript
- Não escrever queries SQL cruas — usar Drizzle query builder
- Não armazenar valores monetários como REAL/float — usar INTEGER (centavos)
- Não armazenar dados sensíveis fora do SQLite local
- Não adicionar dependências desnecessárias sem discutir primeiro
- Não modificar `src/db/schema.ts` sem gerar a migração correspondente via drizzle-kit

## Referência de UX
O módulo financeiro do app "Rebu" (Google Play) é a referência visual.
Priorize clareza, legibilidade de valores monetários e fluxo rápido de entrada.
```

### 4.2 `.claude/settings.json` (Configuração do Projeto — versionada no Git)

Este arquivo controla as permissões de ferramentas, hooks de automação e variáveis de ambiente para toda a equipe.

```json
{
  "$schema": "https://json.schemastore.org/claude-settings.json",

  "permissions": {
    "allow": [
      "Read(**)",
      "Write(src/**)",
      "Write(app/**)",
      "Write(assets/**)",
      "Write(drizzle/**)",
      "Write(drizzle.config.ts)",
      "Bash(npm run *)",
      "Bash(npx expo *)",
      "Bash(npx eas *)",
      "Bash(npx drizzle-kit *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git log *)",
      "Bash(git branch *)",
      "Bash(git checkout *)",
      "Bash(git push origin *)",
      "Bash(git pull)",
      "Bash(npx tsc --noEmit)",
      "Bash(npx jest *)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(**/*.pem)",
      "Read(**/*.key)",
      "Read(**/*.p8)",
      "Read(**/*.p12)",
      "Read(**/*.mobileprovision)",
      "Write(.env)",
      "Write(.env.*)",
      "Write(package.json)",
      "Write(package-lock.json)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(git rebase *)",
      "Bash(npx eas secret *)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  },

  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(**/*.ts)",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix ${CLAUDE_TOOL_WRITE_PATH} 2>/dev/null; npx prettier --write ${CLAUDE_TOOL_WRITE_PATH} 2>/dev/null"
          }
        ]
      },
      {
        "matcher": "Write(**/*.tsx)",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix ${CLAUDE_TOOL_WRITE_PATH} 2>/dev/null; npx prettier --write ${CLAUDE_TOOL_WRITE_PATH} 2>/dev/null"
          }
        ]
      }
    ]
  },

  "env": {
    "NODE_ENV": "development",
    "EXPO_NO_TELEMETRY": "1"
  },

  "model": "claude-sonnet-4-6",

  "attribution": {
    "commits": true,
    "pullRequests": false
  }
}
```

### 4.3 `.claude/settings.local.json` (Configuração Pessoal — NÃO versionar)

Adicione `settings.local.json` ao `.gitignore`. Este arquivo é para preferências individuais que não devem ser compartilhadas.

```json
{
  "theme": "dark",
  "spinnerTipsEnabled": false,
  "model": "claude-opus-4-6"
}
```

### 4.4 `.mcp.json` (Servidores MCP — versionado no Git)

MCP (Model Context Protocol) estende o Claude Code com ferramentas externas. Para este projeto, a configuração recomendada é:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "description": "Documentação atualizada de bibliotecas via Context7"
    }
  }
}
```

**Para adicionar via CLI:**
```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### 4.5 `.claude/commands/` (Comandos Customizados)

Comandos customizados são invocados com `/nome-do-comando` dentro de uma sessão Claude Code.

**`.claude/commands/new-feature.md`**
```markdown
---
description: Scaffold de uma nova funcionalidade seguindo a arquitetura do projeto
---

Crie o scaffold completo para a funcionalidade: $ARGUMENTS

Siga rigorosamente esta estrutura:
1. Tela em `app/` (se aplicável)
2. Schema Drizzle (se precisar de nova tabela) em `src/db/schema.ts`
3. Queries Drizzle em `src/db/queries/`
4. Hook reativo em `src/hooks/` (usando useLiveQuery quando aplicável)
5. Store Zustand em `src/stores/` (apenas para estado de UI, não para dados persistidos)
6. Componentes em `src/components/`
7. Testes em `__tests__/`

Use TypeScript strict. Nenhum `any`. Strings de UI em pt-BR.
Valores monetários em centavos (INTEGER).
```

**`.claude/commands/run-tests.md`**
```markdown
---
allowed-tools: Bash(npx jest *), Bash(npx tsc --noEmit), Read(**)
description: Executa suite de testes e verificação de tipos
---

Execute em sequência:
1. `npx tsc --noEmit` — verificação de tipos
2. `npx jest --passWithNoTests` — testes unitários

Reporte todos os erros encontrados e proponha correções para cada um.
```

**`.claude/commands/db-migrate.md`**
```markdown
---
description: Cria uma nova migração de banco de dados via Drizzle
---

Aplique a seguinte alteração no schema: $ARGUMENTS

1. Modifique `src/db/schema.ts` com as alterações necessárias
2. Execute `npx drizzle-kit generate` para gerar a migração SQL automaticamente
3. Verifique o arquivo de migração gerado em `drizzle/migrations/`
4. Atualize tipos/queries afetados em `src/db/queries/`
5. Nunca edite arquivos de migração gerados manualmente
```

### 4.6 `.gitignore` — Entradas Relevantes para Claude Code

Adicione estas entradas ao seu `.gitignore`:

```gitignore
# Claude Code — arquivos pessoais
.claude/settings.local.json
CLAUDE.local.md

# Segredos — nunca versionar
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

---

## 5. Pipeline CI/CD com GitHub Actions

### 5.1 `.github/workflows/ci.yml` — Integração Contínua

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint, Types e Testes
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Verificação de tipos
        run: npx tsc --noEmit

      - name: Lint
        run: npx eslint . --ext .ts,.tsx --max-warnings 0

      - name: Testes unitários
        run: npx jest --coverage --passWithNoTests

      - name: Upload cobertura
        uses: codecov/codecov-action@v4
        if: always()
```

### 5.2 `.github/workflows/build.yml` — Build EAS (Preview)

```yaml
name: Build Preview

on:
  push:
    branches: [main]

jobs:
  build-android:
    name: Build Android Preview
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: npm ci

      - name: Build Android (Preview)
        run: npx eas build --platform android --profile preview --non-interactive
```

**Segredos necessários no GitHub Repository Settings:**
- `EXPO_TOKEN` — token da conta Expo/EAS

---

## 6. Guia de Início Rápido

### Pré-requisitos

```bash
node >= 22.x
npm >= 10.x
git >= 2.x
claude (Claude Code CLI) — instalado via npm install -g @anthropic-ai/claude-code
```

### Setup inicial

```bash
# 1. Criar projeto Expo
npx create-expo-app driverfinance --template blank-typescript
cd driverfinance

# 2. Instalar dependências principais
npx expo install expo-sqlite expo-sharing expo-file-system expo-haptics expo-router
npm install zustand date-fns drizzle-orm victory-native \
  @shopify/react-native-skia react-native-reanimated \
  react-native-gesture-handler react-native-safe-area-context

# 3. Instalar dependências de desenvolvimento
npm install -D typescript @types/react @types/react-native \
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-plugin-react-native prettier jest @testing-library/react-native \
  drizzle-kit

# 4. Criar estrutura de pastas Claude Code
mkdir -p .claude/commands

# 5. Criar arquivos de configuração (copie os conteúdos da seção 4)
touch CLAUDE.md
touch .claude/settings.json
touch .claude/settings.local.json  # adicionar ao .gitignore
touch .mcp.json
touch drizzle.config.ts

# 6. Inicializar Claude Code
claude
```

### Primeiros passos com Claude Code CLI

Após abrir o Claude Code (`claude` no terminal), use os prompts abaixo para iniciar o desenvolvimento:

```
> Leia o CLAUDE.md e confirme que entendeu a arquitetura do projeto

> Crie o schema Drizzle ORM em src/db/schema.ts e o client em src/db/client.ts
  com as tabelas: income, expenses, custom_categories e settings

> Gere a primeira migração com: npx drizzle-kit generate

> Crie o componente de formulário de nova receita em app/(tabs)/(income)/new.tsx
  seguindo as convenções do CLAUDE.md

> /run-tests
```

---

## 7. Fluxos de Telas

```
Tab Bar (NativeTabs — componente nativo do SO)
├── Dashboard
│   ├── Seletor de período (Dia / Semana / Mês)
│   ├── Cards: Receita Bruta | Despesas | Lucro Líquido
│   ├── Indicadores: R$/km | Custo/km | km total
│   ├── Gráfico de barras Victory Native XL (semanal/mensal)
│   └── Barra de progresso de meta mensal
│
├── Receitas
│   ├── Header com total do período ativo
│   ├── Lista de receitas (cronológica reversa, reativa via useLiveQuery)
│   │   └── Swipe left → Deletar (react-native-gesture-handler + haptics)
│   └── FAB (+) → Tela Nova Receita
│       ├── Campo: Valor (R$) — obrigatório
│       ├── Campo: Plataforma (picker) — pré-preenchido com última usada
│       ├── Campo: Odômetro Início (km) — pré-preenchido com último fim
│       ├── Campo: Odômetro Fim (km)
│       └── Campo: Data/Hora — pré-preenchido com agora
│
├── Despesas
│   ├── Header com total do período ativo
│   ├── Lista de despesas por categoria (reativa via useLiveQuery)
│   │   └── Swipe left → Deletar (react-native-gesture-handler + haptics)
│   └── FAB (+) → Tela Nova Despesa
│       ├── Campo: Valor (R$) — obrigatório
│       ├── Campo: Categoria (picker) — obrigatório
│       ├── Campos condicionais Abastecimento
│       ├── Campo: Descrição (opcional)
│       └── Campo: Data — pré-preenchido com hoje
│
└── Configurações
    ├── Nome do motorista
    ├── Modelo do veículo
    ├── Meta de lucro líquido mensal
    ├── Exportar CSV (período atual)
    ├── Gerenciar categorias personalizadas
    └── Limpar todos os dados (confirmação em 2 etapas)
```

---

## 8. Critérios de Aceite por Funcionalidade

### CA-01: Registro de Receita
- [ ] Formulário valida campos obrigatórios (valor e plataforma) antes de salvar
- [ ] Valor deve ser > 0
- [ ] Odômetro fim deve ser >= odômetro início (quando ambos preenchidos)
- [ ] Smart defaults funcionam: data/hora atual, última plataforma, último odômetro
- [ ] Após salvar, retorna à tela de receitas com item adicionado ao topo da lista
- [ ] Receita aparece no dashboard do dia correspondente (reativo via useLiveQuery)

### CA-02: Registro de Despesa
- [ ] Formulário valida valor > 0 e categoria obrigatória
- [ ] Para Abastecimento: valor total = litros × preço/litro (quando litros e preço preenchidos)
- [ ] Após salvar, retorna à lista com item adicionado

### CA-03: Dashboard
- [ ] Trocar período atualiza todos os cards e gráfico em < 300ms
- [ ] Lucro líquido negativo exibe em vermelho
- [ ] Quando não há dados no período, exibe estado vazio com call-to-action
- [ ] Indicadores km ficam ocultos quando nenhuma receita tem odômetro registrado
- [ ] Gráfico de barras Victory Native XL renderiza com animação suave (60fps)

### CA-04: Exportação CSV
- [ ] CSV gerado contém cabeçalho em pt-BR
- [ ] Share sheet nativa abre com o arquivo após geração
- [ ] Valores monetários no CSV usam ponto como decimal (padrão CSV internacional)
- [ ] Valores são convertidos de centavos para reais no CSV

### CA-05: Resiliência
- [ ] Error boundaries capturam crashes de componentes e exibem fallback
- [ ] Operações de banco de dados tratam erros (disco cheio, DB corrompido) com mensagem amigável
- [ ] App não crasha com dados corrompidos — exibe estado de recuperação

---

## 9. Estratégia de Testes

### 9.1 O que testar

| Camada | O que testar | Ferramenta |
|--------|-------------|------------|
| `src/utils/` | Funções puras: currency.ts, calculations.ts, export.ts | Jest |
| `src/db/queries/` | Queries Drizzle: inserção, atualização, deleção, agregações | Jest + expo-sqlite in-memory |
| `src/stores/` | Ações de store: mutações de estado, side-effects | Jest |
| `src/components/forms/` | Validação de formulários, estados de erro, submit | React Native Testing Library |
| `src/hooks/` | Custom hooks: filtros de período, formatação | @testing-library/react-hooks |

### 9.2 O que NÃO testar na v1.0

- Navegação entre telas (testado manualmente)
- Renderização de gráficos Victory Native XL (dependência nativa)
- Integração com share sheet nativa
- Componentes de UI base sem lógica (Button, Card)

---

## 10. Boas Práticas de Segurança com Claude Code CLI

1. **Nunca versionar `.env` e credenciais** — as regras `deny` no `settings.json` impedem que o Claude acesse esses arquivos, mas o `.gitignore` é a linha de defesa primária.

2. **Restringir comandos destrutivos** — `rm -rf`, `git push --force` e `git rebase` estão explicitamente negados no `settings.json`.

3. **Bloquear acesso a certificados** — arquivos `.p8`, `.p12`, `.pem` e `.mobileprovision` usados pelo EAS estão na lista `deny`.

4. **Não compartilhar `settings.local.json`** — pode conter variações de modelo ou tokens locais.

5. **Revisar hooks antes de commitar** — hooks no `settings.json` executam código automaticamente; inspecione qualquer mudança com `git diff .claude/settings.json`.

6. **Usar `--append-system-prompt` para sessões especiais** — para tarefas de segurança ou refatoração crítica:
   ```bash
   claude --append-system-prompt 'Priorize segurança. Revise todas as queries Drizzle para edge cases.'
   ```

7. **Aliases úteis para workflows recorrentes:**
   ```bash
   alias claude-mobile="claude --append-system-prompt 'Você está desenvolvendo um app React Native. Considere sempre Android e iOS.'"
   alias claude-db="claude --append-system-prompt 'Foco em banco de dados SQLite com Drizzle ORM. Use o query builder type-safe. Gere migrações via drizzle-kit.'"
   ```

---

## 11. Referências

- [Expo SDK 55 Documentation](https://docs.expo.dev)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Drizzle ORM — Expo SQLite](https://orm.drizzle.team/docs/get-started/expo-new)
- [Drizzle ORM — useLiveQuery](https://orm.drizzle.team/docs/connect-expo-sqlite)
- [Expo Router v4](https://docs.expo.dev/router/introduction/)
- [Expo NativeTabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Navigation 7.x](https://reactnavigation.org)
- [Victory Native XL](https://commerce.nearform.com/open-source/victory-native/)
- [Zustand 5.x](https://zustand-demo.pmnd.rs)
- [date-fns 4.x](https://date-fns.org)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

---

*Documento atualizado em Março/2026 — versão 2.0.0*
