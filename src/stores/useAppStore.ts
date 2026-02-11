import { create } from 'zustand';
import type {
  Transaction,
  Investment,
  MonthSummary,
  Insight,
  MonthInfo,
} from '../types/api';
import * as api from '../services/api';
import { format } from 'date-fns';

interface AppState {
  // Current state
  currentMonth: string;
  months: MonthInfo[];
  transactions: Transaction[];
  investments: Investment[];
  summary: MonthSummary | null;
  insights: Insight[];
  
  // Loading states
  isLoading: boolean;
  isLoadingTransactions: boolean;
  isLoadingInvestments: boolean;
  isLoadingSummary: boolean;
  isLoadingInsights: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  setCurrentMonth: (month: string) => Promise<void>;
  loadMonthData: (month: string) => Promise<void>;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Investment actions
  addInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>;
  updateInvestment: (id: string, updates: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentMonth: format(new Date(), 'yyyy-MM'),
  months: [],
  transactions: [],
  investments: [],
  summary: null,
  insights: [],
  
  isLoading: false,
  isLoadingTransactions: false,
  isLoadingInvestments: false,
  isLoadingSummary: false,
  isLoadingInsights: false,
  
  error: null,
  
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Ensure current month file exists
      const { month } = await api.ensureCurrentMonth();
      
      // Load available months
      const months = await api.listMonths();
      
      set({ currentMonth: month, months });
      
      // Load current month data
      await get().loadMonthData(month);
      
    } catch (error) {
      console.error('Failed to initialize:', error);
      set({ error: 'Falha ao inicializar aplicação' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setCurrentMonth: async (month: string) => {
    set({ currentMonth: month });
    await get().loadMonthData(month);
  },
  
  loadMonthData: async (month: string) => {
    const state = get();
    
    try {
      // Load all data in parallel
      set({
        isLoadingTransactions: true,
        isLoadingInvestments: true,
        isLoadingSummary: true,
        isLoadingInsights: true,
        error: null,
      });
      
      const [transactions, investments, summary, insights] = await Promise.all([
        api.getTransactions(month),
        api.getInvestments(month),
        api.getMonthSummary(month),
        api.getInsights(month),
      ]);
      
      set({
        transactions,
        investments,
        summary,
        insights,
      });
      
    } catch (error) {
      console.error('Failed to load month data:', error);
      set({ error: 'Falha ao carregar dados do mês' });
    } finally {
      set({
        isLoadingTransactions: false,
        isLoadingInvestments: false,
        isLoadingSummary: false,
        isLoadingInsights: false,
      });
    }
  },
  
  addTransaction: async (transaction) => {
    try {
      const { currentMonth } = get();
      const newTransaction = await api.createTransaction(currentMonth, transaction);
      
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
      }));
      
      // Reload summary and insights
      const [summary, insights] = await Promise.all([
        api.getMonthSummary(currentMonth),
        api.getInsights(currentMonth),
      ]);
      
      set({ summary, insights });
      
    } catch (error) {
      console.error('Failed to add transaction:', error);
      set({ error: 'Falha ao adicionar transação' });
      throw error;
    }
  },
  
  updateTransaction: async (id, updates) => {
    try {
      const { currentMonth } = get();
      const updated = await api.updateTransaction(currentMonth, id, updates);
      
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? updated : t)),
      }));
      
      // Reload summary and insights
      const [summary, insights] = await Promise.all([
        api.getMonthSummary(currentMonth),
        api.getInsights(currentMonth),
      ]);
      
      set({ summary, insights });
      
    } catch (error) {
      console.error('Failed to update transaction:', error);
      set({ error: 'Falha ao atualizar transação' });
      throw error;
    }
  },
  
  deleteTransaction: async (id) => {
    try {
      const { currentMonth } = get();
      await api.deleteTransaction(currentMonth, id);
      
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
      
      // Reload summary and insights
      const [summary, insights] = await Promise.all([
        api.getMonthSummary(currentMonth),
        api.getInsights(currentMonth),
      ]);
      
      set({ summary, insights });
      
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      set({ error: 'Falha ao excluir transação' });
      throw error;
    }
  },
  
  addInvestment: async (investment) => {
    try {
      const { currentMonth } = get();
      const newInvestment = await api.createInvestment(currentMonth, investment);
      
      set((state) => ({
        investments: [...state.investments, newInvestment],
      }));
      
      // Reload summary
      const summary = await api.getMonthSummary(currentMonth);
      set({ summary });
      
    } catch (error) {
      console.error('Failed to add investment:', error);
      set({ error: 'Falha ao adicionar investimento' });
      throw error;
    }
  },
  
  updateInvestment: async (id, updates) => {
    try {
      const { currentMonth } = get();
      const updated = await api.updateInvestment(currentMonth, id, updates);
      
      set((state) => ({
        investments: state.investments.map((i) => (i.id === id ? updated : i)),
      }));
      
      // Reload summary
      const summary = await api.getMonthSummary(currentMonth);
      set({ summary });
      
    } catch (error) {
      console.error('Failed to update investment:', error);
      set({ error: 'Falha ao atualizar investimento' });
      throw error;
    }
  },
  
  deleteInvestment: async (id) => {
    try {
      const { currentMonth } = get();
      await api.deleteInvestment(currentMonth, id);
      
      set((state) => ({
        investments: state.investments.filter((i) => i.id !== id),
      }));
      
      // Reload summary
      const summary = await api.getMonthSummary(currentMonth);
      set({ summary });
      
    } catch (error) {
      console.error('Failed to delete investment:', error);
      set({ error: 'Falha ao excluir investimento' });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}));
