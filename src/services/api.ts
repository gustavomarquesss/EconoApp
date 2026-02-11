import axios from 'axios';
import type {
  Transaction,
  CreateTransaction,
  Investment,
  CreateInvestment,
  MonthSummary,
  Insight,
  MonthInfo,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Months
export const listMonths = async (): Promise<MonthInfo[]> => {
  const response = await api.get('/months');
  return response.data;
};

export const ensureCurrentMonth = async (): Promise<{ month: string }> => {
  const response = await api.post('/months/ensure-current');
  return response.data;
};

export const getMonthSummary = async (month: string): Promise<MonthSummary> => {
  const response = await api.get(`/months/${month}/summary`);
  return response.data;
};

export const getInsights = async (month: string): Promise<Insight[]> => {
  const response = await api.get(`/months/${month}/insights`);
  return response.data;
};

// Transactions
export const getTransactions = async (month: string): Promise<Transaction[]> => {
  const response = await api.get(`/months/${month}/transactions`);
  return response.data;
};

export const createTransaction = async (
  month: string,
  transaction: CreateTransaction
): Promise<Transaction> => {
  const response = await api.post(`/months/${month}/transactions`, transaction);
  return response.data;
};

export const updateTransaction = async (
  month: string,
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction> => {
  const response = await api.put(`/months/${month}/transactions/${id}`, updates);
  return response.data;
};

export const deleteTransaction = async (month: string, id: string): Promise<void> => {
  await api.delete(`/months/${month}/transactions/${id}`);
};

// Investments
export const getInvestments = async (month: string): Promise<Investment[]> => {
  const response = await api.get(`/months/${month}/investments`);
  return response.data;
};

export const createInvestment = async (
  month: string,
  investment: CreateInvestment
): Promise<Investment> => {
  const response = await api.post(`/months/${month}/investments`, investment);
  return response.data;
};

export const updateInvestment = async (
  month: string,
  id: string,
  updates: Partial<Investment>
): Promise<Investment> => {
  const response = await api.put(`/months/${month}/investments/${id}`, updates);
  return response.data;
};

export const deleteInvestment = async (month: string, id: string): Promise<void> => {
  await api.delete(`/months/${month}/investments/${id}`);
};

export default api;
