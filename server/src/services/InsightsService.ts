import { ExcelRepository } from '../repositories/ExcelRepository.js';
import { MonthService } from './MonthService.js';
import type { Insight, Transaction } from '../types/index.js';

export class InsightsService {
  private repository: ExcelRepository;
  private monthService: MonthService;

  constructor() {
    this.repository = new ExcelRepository();
    this.monthService = new MonthService();
  }

  async generateInsights(month: string): Promise<Insight[]> {
    const insights: Insight[] = [];
    const transactions = await this.repository.getTransactions(month);
    const expenses = transactions.filter(t => t.type === 'EXPENSE');

    // Get comparison with previous month
    const comparison = await this.monthService.compareWithPreviousMonth(month);

    // Insight 1: Expense increase vs previous month
    if (comparison.previous && comparison.changes.expensesChange > 10) {
      insights.push({
        id: 'expense-increase',
        type: 'warning',
        title: 'Gastos aumentaram significativamente',
        description: `Seus gastos aumentaram ${comparison.changes.expensesChange.toFixed(1)}% em relação ao mês anterior.`,
        amount: comparison.current.totalExpenses - comparison.previous.totalExpenses,
      });
    }

    // Insight 2: Top expense categories
    const categoryTotals = this.groupByCategory(expenses);
    const topCategory = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      const [category, amount] = topCategory;
      const percentage = (amount / comparison.current.totalExpenses) * 100;
      
      insights.push({
        id: 'top-category',
        type: 'info',
        title: 'Maior categoria de gastos',
        description: `${category} representa ${percentage.toFixed(1)}% dos seus gastos este mês.`,
        amount,
        category,
      });
    }

    // Insight 3: Recurring expenses
    const recurringExpenses = expenses.filter(t => t.isRecurring);
    if (recurringExpenses.length > 0) {
      const recurringTotal = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);
      insights.push({
        id: 'recurring-expenses',
        type: 'info',
        title: 'Gastos recorrentes',
        description: `Você tem ${recurringExpenses.length} gastos recorrentes totalizando R$ ${recurringTotal.toFixed(2)}.`,
        amount: recurringTotal,
      });
    }

    // Insight 4: Delivery expenses (if high)
    const deliveryExpenses = expenses.filter(t => 
      t.category.toLowerCase().includes('delivery') || 
      t.description.toLowerCase().includes('delivery') ||
      t.description.toLowerCase().includes('ifood') ||
      t.description.toLowerCase().includes('rappi')
    );
    
    if (deliveryExpenses.length > 0) {
      const deliveryTotal = deliveryExpenses.reduce((sum, t) => sum + t.amount, 0);
      const deliveryPercentage = (deliveryTotal / comparison.current.totalExpenses) * 100;
      
      if (deliveryPercentage > 10) {
        insights.push({
          id: 'delivery-high',
          type: 'warning',
          title: 'Gastos com delivery acima da média',
          description: `Você gastou R$ ${deliveryTotal.toFixed(2)} com delivery (${deliveryPercentage.toFixed(1)}% dos gastos).`,
          amount: deliveryTotal,
          category: 'Delivery',
        });
      }
    }

    // Insight 5: Savings opportunity
    if (comparison.current.balance > 0) {
      insights.push({
        id: 'savings-success',
        type: 'success',
        title: 'Parabéns! Você economizou este mês',
        description: `Seu saldo positivo é de R$ ${comparison.current.balance.toFixed(2)}.`,
        amount: comparison.current.balance,
      });
    } else if (comparison.current.balance < 0) {
      insights.push({
        id: 'negative-balance',
        type: 'warning',
        title: 'Atenção: Saldo negativo',
        description: `Você gastou R$ ${Math.abs(comparison.current.balance).toFixed(2)} a mais do que ganhou.`,
        amount: comparison.current.balance,
      });
    }

    // Insight 6: Savings tip - reduce top category by 10%
    if (topCategory) {
      const [category, amount] = topCategory;
      const savingsPotential = amount * 0.1;
      insights.push({
        id: 'savings-tip',
        type: 'tip',
        title: 'Dica de economia',
        description: `Se você reduzir 10% em ${category}, pode economizar R$ ${savingsPotential.toFixed(2)}.`,
        amount: savingsPotential,
        category,
      });
    }

    // Insight 7: Payment method analysis
    const creditExpenses = expenses.filter(t => t.paymentMethod === 'CREDIT');
    if (creditExpenses.length > 0) {
      const creditTotal = creditExpenses.reduce((sum, t) => sum + t.amount, 0);
      const creditPercentage = (creditTotal / comparison.current.totalExpenses) * 100;
      
      insights.push({
        id: 'credit-usage',
        type: 'info',
        title: 'Uso de cartão de crédito',
        description: `${creditPercentage.toFixed(1)}% dos seus gastos foram no crédito (R$ ${creditTotal.toFixed(2)}).`,
        amount: creditTotal,
      });
    }

    // Insight 8: Category comparison with previous month
    if (comparison.previous) {
      const prevTransactions = await this.repository.getTransactions(comparison.previous.month);
      const prevExpenses = prevTransactions.filter(t => t.type === 'EXPENSE');
      const prevCategoryTotals = this.groupByCategory(prevExpenses);

      categoryTotals.forEach((currentAmount, category) => {
        const prevAmount = prevCategoryTotals.get(category) || 0;
        if (prevAmount > 0) {
          const change = ((currentAmount - prevAmount) / prevAmount) * 100;
          if (Math.abs(change) > 20) {
            insights.push({
              id: `category-change-${category}`,
              type: change > 0 ? 'warning' : 'success',
              title: `${category}: ${change > 0 ? 'Aumento' : 'Redução'} significativo`,
              description: `Gastos em ${category} ${change > 0 ? 'aumentaram' : 'diminuíram'} ${Math.abs(change).toFixed(1)}% vs mês anterior.`,
              amount: currentAmount - prevAmount,
              category,
            });
          }
        }
      });
    }

    // Insight 9: Fixed vs Variable expenses
    const fixedCategories = ['Moradia', 'Contas', 'Assinaturas', 'Saúde'];
    const fixedExpenses = expenses.filter(t => 
      fixedCategories.some(cat => t.category.toLowerCase().includes(cat.toLowerCase()))
    );
    const variableExpenses = expenses.filter(t => 
      !fixedCategories.some(cat => t.category.toLowerCase().includes(cat.toLowerCase()))
    );

    const fixedTotal = fixedExpenses.reduce((sum, t) => sum + t.amount, 0);
    const variableTotal = variableExpenses.reduce((sum, t) => sum + t.amount, 0);

    if (variableTotal > fixedTotal) {
      insights.push({
        id: 'variable-high',
        type: 'info',
        title: 'Gastos variáveis predominam',
        description: `Seus gastos variáveis (R$ ${variableTotal.toFixed(2)}) são maiores que os fixos (R$ ${fixedTotal.toFixed(2)}).`,
      });
    }

    return insights;
  }

  private groupByCategory(transactions: Transaction[]): Map<string, number> {
    const map = new Map<string, number>();
    transactions.forEach(t => {
      const current = map.get(t.category) || 0;
      map.set(t.category, current + t.amount);
    });
    return map;
  }
}
