import { z } from 'zod';

// Enums
export const TransactionTypeEnum = z.enum(['INCOME', 'EXPENSE']);
export const PaymentMethodEnum = z.enum(['PIX', 'DEBIT', 'CREDIT', 'CASH', 'TRANSFER', 'OTHER']);
export const InvestmentTypeEnum = z.enum(['CDB', 'TESOURO', 'FII', 'ACOES', 'CRIPTO', 'POUPANCA', 'OTHER']);

// Transaction Schema
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: TransactionTypeEnum,
  description: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  amount: z.number().positive(),
  paymentMethod: PaymentMethodEnum,
  isRecurring: z.boolean().default(false),
  tags: z.string().optional(),
});

export const CreateTransactionSchema = TransactionSchema.omit({ id: true });

// Investment Schema
export const InvestmentSchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  investmentType: InvestmentTypeEnum,
  broker: z.string().optional(),
  description: z.string().min(1),
  amountApplied: z.number().positive(),
  currentValue: z.number().optional(),
  notes: z.string().optional(),
});

export const CreateInvestmentSchema = InvestmentSchema.omit({ id: true });

// Types
export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type Investment = z.infer<typeof InvestmentSchema>;
export type CreateInvestment = z.infer<typeof CreateInvestmentSchema>;
export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
export type InvestmentType = z.infer<typeof InvestmentTypeEnum>;

// API Response Types
export interface MonthSummary {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savings: number;
  transactionCount: number;
  investmentCount: number;
  topCategories: Array<{ category: string; amount: number; percentage: number }>;
}

export interface Insight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  description: string;
  amount?: number;
  category?: string;
}

export interface MonthInfo {
  month: string;
  fileName: string;
  isCurrent: boolean;
  summary?: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
}

// Constants
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
  CASH: 'Dinheiro',
  TRANSFER: 'Transferência',
  OTHER: 'Outro',
};

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  CDB: 'CDB',
  TESOURO: 'Tesouro Direto',
  FII: 'Fundos Imobiliários',
  ACOES: 'Ações',
  CRIPTO: 'Criptomoedas',
  POUPANCA: 'Poupança',
  OTHER: 'Outro',
};

export const CATEGORIES = {
  EXPENSE: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Assinaturas',
    'Delivery',
    'Compras',
    'Contas',
    'Outros',
  ],
  INCOME: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Outros',
  ],
};
