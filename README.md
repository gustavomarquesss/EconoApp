# 💰 EconoApp v2.0

Sistema completo de controle financeiro mensal com armazenamento em Excel, dashboards interativos, insights automáticos e gestão de investimentos.

## 🚀 Características Principais

### 📊 Dashboard Completo
- Visão geral de receitas, despesas, saldo e economia
- Gráficos de pizza por categoria
- Gráficos de linha para gastos diários
- Ranking de categorias com percentuais

### 💳 Gestão de Transações
- CRUD completo de transações (receitas e despesas)
- Categorização inteligente
- Múltiplos métodos de pagamento (PIX, Débito, Crédito, Dinheiro, etc.)
- Marcação de transações recorrentes
- Sistema de tags
- Interface com DataGrid do MUI

### 📈 Investimentos
- Registro de investimentos (CDB, Tesouro, FII, Ações, Cripto, etc.)
- Acompanhamento de rentabilidade
- Cálculo automático de retorno percentual
- Gestão por corretora

### 💡 Insights Automáticos
- Análise de padrões de gastos
- Comparação com mês anterior
- Identificação de categorias com aumento significativo
- Sugestões de economia personalizadas
- Alertas de gastos acima da média
- Análise de gastos fixos vs variáveis

### 📅 Navegação por Meses
- Rotação automática mensal
- Histórico completo de meses anteriores
- Cada mês salvo em arquivo Excel separado
- Visualização de resumo por mês

### 🗄️ Armazenamento em Excel
- Cada mês = 1 arquivo .xlsx
- Estrutura organizada em abas (Transactions, Investments, Settings, Categories)
- Fácil backup e portabilidade
- Sem necessidade de banco de dados externo

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool rápido
- **Material-UI (MUI)** - Componentes e DataGrid
- **TailwindCSS** - Utility-first CSS
- **Zustand** - Gerenciamento de estado
- **Recharts** - Gráficos interativos
- **React Hook Form** + **Zod** - Formulários e validação
- **date-fns** - Manipulação de datas
- **Axios** - Cliente HTTP

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **ExcelJS** - Leitura/escrita de arquivos Excel
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas

## 📁 Estrutura do Projeto

```
EconoApp/
├── src/                          # Frontend
│   ├── app/                      # Layout e configuração de rotas
│   │   └── Layout.tsx
│   ├── features/                 # Features organizadas por domínio
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── transactions/
│   │   │   ├── Transactions.tsx
│   │   │   └── TransactionModal.tsx
│   │   ├── investments/
│   │   │   ├── Investments.tsx
│   │   │   └── InvestmentModal.tsx
│   │   ├── insights/
│   │   │   └── Insights.tsx
│   │   ├── months/
│   │   │   └── Months.tsx
│   │   └── settings/
│   │       └── Settings.tsx
│   ├── stores/                   # Zustand stores
│   │   └── useAppStore.ts
│   ├── services/                 # API client
│   │   └── api.ts
│   ├── types/                    # TypeScript types e schemas Zod
│   │   └── api.ts
│   ├── App.tsx
│   └── main.tsx
│
├── server/                       # Backend
│   ├── src/
│   │   ├── controllers/          # Controllers da API
│   │   │   ├── MonthController.ts
│   │   │   ├── TransactionController.ts
│   │   │   └── InvestmentController.ts
│   │   ├── services/             # Lógica de negócio
│   │   │   ├── MonthService.ts
│   │   │   └── InsightsService.ts
│   │   ├── repositories/         # Acesso aos dados (Excel)
│   │   │   └── ExcelRepository.ts
│   │   ├── routes/               # Rotas da API
│   │   │   └── index.ts
│   │   ├── types/                # Types e schemas
│   │   │   └── index.ts
│   │   └── index.ts              # Entry point
│   ├── data/
│   │   ├── months/               # Arquivos Excel por mês (YYYY-MM.xlsx)
│   │   └── templates/            # Template base do Excel
│   ├── package.json
│   └── tsconfig.json
│
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd EconoApp
```

2. **Instale as dependências (frontend e backend)**
```bash
npm run install:all
```

Ou manualmente:
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

3. **Configure as variáveis de ambiente (opcional)**
```bash
cp .env.example .env
```

### Executar em Desenvolvimento

**Rodar frontend + backend juntos:**
```bash
npm run dev
```

Isso iniciará:
- Frontend em `http://localhost:5173`
- Backend em `http://localhost:3001`

**Ou rodar separadamente:**

Terminal 1 (Frontend):
```bash
npm run dev:frontend
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

### Build para Produção

```bash
# Frontend
npm run build

# Backend
npm run build:backend
```

## 📊 Formato do Excel

Cada mês é salvo como `YYYY-MM.xlsx` em `server/data/months/`.

### Abas do Excel:

#### 1. Transactions
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| date | YYYY-MM-DD | Data da transação |
| type | INCOME/EXPENSE | Tipo |
| description | String | Descrição |
| category | String | Categoria |
| subcategory | String | Subcategoria (opcional) |
| amount | Number | Valor |
| paymentMethod | Enum | PIX, DEBIT, CREDIT, CASH, TRANSFER, OTHER |
| isRecurring | Boolean | Se é recorrente |
| tags | String | Tags separadas por vírgula |

#### 2. Investments
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| date | YYYY-MM-DD | Data do aporte |
| investmentType | Enum | CDB, TESOURO, FII, ACOES, CRIPTO, POUPANCA, OTHER |
| broker | String | Corretora (opcional) |
| description | String | Descrição |
| amountApplied | Number | Valor aplicado |
| currentValue | Number | Valor atual (opcional) |
| notes | String | Observações |

#### 3. Settings
Configurações do mês (metas, limites por categoria)

#### 4. Categories
Lista de categorias predefinidas

## 🔄 Rotação Automática de Mês

Ao iniciar o app:
1. Backend verifica se existe arquivo do mês atual
2. Se não existe:
   - Cria novo arquivo a partir do template
   - Mês anterior fica "fechado" (não é mais editado)
3. Frontend carrega automaticamente o mês atual

## 🎯 API Endpoints

### Months
- `GET /api/months` - Lista meses disponíveis
- `POST /api/months/ensure-current` - Garante arquivo do mês atual
- `GET /api/months/:month/summary` - Resumo do mês
- `GET /api/months/:month/insights` - Insights automáticos

### Transactions
- `GET /api/months/:month/transactions` - Lista transações
- `POST /api/months/:month/transactions` - Cria transação
- `PUT /api/months/:month/transactions/:id` - Atualiza transação
- `DELETE /api/months/:month/transactions/:id` - Remove transação

### Investments
- `GET /api/months/:month/investments` - Lista investimentos
- `POST /api/months/:month/investments` - Cria investimento
- `PUT /api/months/:month/investments/:id` - Atualiza investimento
- `DELETE /api/months/:month/investments/:id` - Remove investimento

## 💡 Insights Automáticos

O sistema analisa automaticamente:
- ✅ Aumento/redução de gastos vs mês anterior
- ✅ Categorias com maior impacto
- ✅ Gastos recorrentes
- ✅ Gastos com delivery acima da média
- ✅ Saldo positivo/negativo
- ✅ Sugestões de economia (redução de 10% por categoria)
- ✅ Análise de uso de cartão de crédito
- ✅ Comparação de categorias entre meses
- ✅ Gastos fixos vs variáveis

## 🎨 Funcionalidades da Interface

- ✅ Sidebar responsiva com navegação
- ✅ Seletor de mês no topo
- ✅ Cards de KPIs no dashboard
- ✅ Gráficos interativos (Recharts)
- ✅ DataGrid com paginação, ordenação e filtros
- ✅ Modais para criar/editar transações e investimentos
- ✅ Formulários validados com React Hook Form + Zod
- ✅ Loading states e empty states
- ✅ Design moderno com Material-UI
- ✅ Tema customizado

## 🔐 Segurança e Backup

- Dados salvos localmente em `server/data/months/`
- Cada mês é um arquivo separado
- Fácil backup: copie a pasta `server/data/`
- Sem dependência de banco de dados externo
- Portabilidade total dos dados

## 🚧 Próximas Melhorias

- [ ] Exportar/importar Excel
- [ ] Metas mensais configuráveis
- [ ] Limites por categoria
- [ ] Notificações e alertas
- [ ] Gráficos de evolução anual
- [ ] Relatórios em PDF
- [ ] Autenticação (multi-usuário)
- [ ] Sincronização em nuvem (opcional)

## 📝 Licença

Este projeto é de código aberto para uso pessoal e educacional.

## 👨‍💻 Desenvolvido com

- ❤️ Paixão por finanças pessoais
- ⚡ Tecnologias modernas
- 🎯 Foco em UX e simplicidade
- 📊 Dados organizados e acessíveis

---

**EconoApp v2.0** - Controle suas finanças com inteligência! 💰📈
