# MotoraFinance — Contexto para Claude Code

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
