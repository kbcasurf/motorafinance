# DriverFinance

Aplicativo Android para controle financeiro de motoristas de aplicativos de mobilidade urbana. Registre receitas, despesas e acompanhe seu lucro líquido — tudo offline, sem cadastro e sem nuvem.

---

## Funcionalidades

### Receitas
- Registre cada corrida com valor, plataforma (Uber, 99, InDrive, Cabify ou outra) e data
- Informe odômetro inicial e final para calcular quilometragem por corrida
- Edite ou exclua entradas a qualquer momento

### Despesas
- Categorias pré-definidas: Abastecimento, Lavagem, Manutenção Preventiva, Manutenção Corretiva, Seguro, IPVA/Licenciamento, Plano de Internet, Acessórios, Depreciação e Outros
- Categoria personalizada: crie suas próprias categorias
- Campos extras para abastecimento: tipo de combustível, litros e preço por litro
- Registro de odômetro por despesa

### Dashboard
- Resumo financeiro com receita bruta, total de despesas e lucro líquido
- Filtros por período: diário, semanal e mensal
- Indicadores de desempenho: receita/km, custo/km e quilometragem total
- Gráfico de barras com evolução de receitas × despesas × lucro
- Barra de progresso da meta mensal configurável

### Configurações e Exportação
- Defina seu nome, veículo e meta mensal de lucro
- Exporte todos os dados como CSV e compartilhe por qualquer app
- Apague todos os dados com confirmação em duas etapas

### Privacidade
- 100% offline — nenhum dado sai do seu celular
- Armazenamento local via SQLite

---

## Instalação via QR Code

Escaneie o QR Code abaixo com a câmera do seu celular Android para baixar e instalar o aplicativo diretamente, sem precisar da Play Store.

<!-- QR Code será adicionado aqui -->

1. Abra a câmera do celular Android
2. Aponte para o QR Code
3. Toque no link que aparecer
4. O navegador abrirá e iniciará o download do APK
5. Após o download, toque em **Abrir** e depois em **Instalar**
6. Se o Android pedir permissão para "instalar de fontes desconhecidas", toque em **Configurações** → ative a permissão → volte e instale

---

## Stack técnica

- React Native 0.83 + Expo SDK 55
- Expo SQLite + Drizzle ORM
- Expo Router v4
- Zustand 5.x
- Victory Native XL (gráficos)
- TypeScript strict mode
