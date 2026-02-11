import { format } from 'date-fns';
import { ExcelRepository } from '../repositories/ExcelRepository.js';
import type { MonthInfo, MonthSummary, Transaction } from '../types/index.js';

export class MonthService {
  private repository: ExcelRepository;

  constructor() {
    this.repository = new ExcelRepository();
  }

  getCurrentMonth(): string {
    return format(new Date(), 'yyyy-MM');
  }

  async ensureCurrentMonth(): Promise<string> {
    const currentMonth = this.getCurrentMonth();
    const exists = await this.repository.fileExists(currentMonth);

    if (!exists) {
      await this.repository.createFromTemplate(currentMonth);
    }

    return currentMonth;
  }

  async listMonths(): Promise<MonthInfo[]> {
    const months = await this.repository.listMonths();
    const currentMonth = this.getCurrentMonth();

    return months.map(month => ({
      month,
      fileName: `${month}.xlsx`,
      isCurrent: month === currentMonth,
    }));
  }

  async getMonthSummary(month: string): Promise<MonthSummary> {
    const transactions = await this.repository.getTransactions(month);
    const investments = await this.repository.getInvestments(month);

    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;
    const savings = balance > 0 ? balance : 0;

    // Top categories
    const categoryMap = new Map<string, number>();
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    const topCategories = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      month,
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      savings,
      transactionCount: transactions.length,
      investmentCount: investments.length,
      topCategories,
    };
  }

  async compareWithPreviousMonth(month: string): Promise<{
    current: MonthSummary;
    previous: MonthSummary | null;
    changes: {
      incomeChange: number;
      expensesChange: number;
      balanceChange: number;
    };
  }> {
    const current = await this.getMonthSummary(month);
    
    // Get previous month
    const [year, monthNum] = month.split('-').map(Number);
    const prevDate = new Date(year, monthNum - 2, 1); // -2 because months are 0-indexed and we want previous
    const previousMonth = format(prevDate, 'yyyy-MM');
    
    let previous: MonthSummary | null = null;
    let changes = {
      incomeChange: 0,
      expensesChange: 0,
      balanceChange: 0,
    };

    const previousExists = await this.repository.fileExists(previousMonth);
    if (previousExists) {
      previous = await this.getMonthSummary(previousMonth);
      
      changes = {
        incomeChange: previous.totalIncome > 0 
          ? ((current.totalIncome - previous.totalIncome) / previous.totalIncome) * 100 
          : 0,
        expensesChange: previous.totalExpenses > 0 
          ? ((current.totalExpenses - previous.totalExpenses) / previous.totalExpenses) * 100 
          : 0,
        balanceChange: current.balance - previous.balance,
      };
    }

    return { current, previous, changes };
  }
}
