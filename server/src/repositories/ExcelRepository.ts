import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, Investment, Settings } from '../types/index.js';

export class ExcelRepository {
  private dataDir: string;
  private templatePath: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data', 'months');
    this.templatePath = path.join(process.cwd(), 'data', 'templates', 'month-template.xlsx');
  }

  async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.mkdir(path.dirname(this.templatePath), { recursive: true });
  }

  getFilePath(month: string): string {
    return path.join(this.dataDir, `${month}.xlsx`);
  }

  async fileExists(month: string): Promise<boolean> {
    try {
      await fs.access(this.getFilePath(month));
      return true;
    } catch {
      return false;
    }
  }

  async listMonths(): Promise<string[]> {
    await this.ensureDirectories();
    try {
      const files = await fs.readdir(this.dataDir);
      return files
        .filter(f => f.endsWith('.xlsx'))
        .map(f => f.replace('.xlsx', ''))
        .sort()
        .reverse();
    } catch {
      return [];
    }
  }

  async createFromTemplate(month: string): Promise<void> {
    await this.ensureDirectories();
    
    const workbook = new ExcelJS.Workbook();
    
    // Sheet: Transactions
    const transactionsSheet = workbook.addWorksheet('Transactions');
    transactionsSheet.columns = [
      { header: 'id', key: 'id', width: 40 },
      { header: 'date', key: 'date', width: 12 },
      { header: 'type', key: 'type', width: 10 },
      { header: 'description', key: 'description', width: 30 },
      { header: 'category', key: 'category', width: 20 },
      { header: 'subcategory', key: 'subcategory', width: 20 },
      { header: 'amount', key: 'amount', width: 15 },
      { header: 'paymentMethod', key: 'paymentMethod', width: 15 },
      { header: 'isRecurring', key: 'isRecurring', width: 12 },
      { header: 'tags', key: 'tags', width: 30 },
    ];

    // Sheet: Investments
    const investmentsSheet = workbook.addWorksheet('Investments');
    investmentsSheet.columns = [
      { header: 'id', key: 'id', width: 40 },
      { header: 'date', key: 'date', width: 12 },
      { header: 'investmentType', key: 'investmentType', width: 15 },
      { header: 'broker', key: 'broker', width: 20 },
      { header: 'description', key: 'description', width: 30 },
      { header: 'amountApplied', key: 'amountApplied', width: 15 },
      { header: 'currentValue', key: 'currentValue', width: 15 },
      { header: 'notes', key: 'notes', width: 40 },
    ];

    // Sheet: Settings
    const settingsSheet = workbook.addWorksheet('Settings');
    settingsSheet.columns = [
      { header: 'key', key: 'key', width: 30 },
      { header: 'value', key: 'value', width: 50 },
    ];
    settingsSheet.addRow({ key: 'monthlyIncomeGoal', value: '' });
    settingsSheet.addRow({ key: 'monthlySavingsGoal', value: '' });
    settingsSheet.addRow({ key: 'categoryLimits', value: '{}' });

    // Sheet: Categories (predefined)
    const categoriesSheet = workbook.addWorksheet('Categories');
    categoriesSheet.columns = [
      { header: 'category', key: 'category', width: 30 },
      { header: 'type', key: 'type', width: 15 },
    ];
    
    const categories = [
      { category: 'Alimentação', type: 'EXPENSE' },
      { category: 'Transporte', type: 'EXPENSE' },
      { category: 'Moradia', type: 'EXPENSE' },
      { category: 'Saúde', type: 'EXPENSE' },
      { category: 'Educação', type: 'EXPENSE' },
      { category: 'Lazer', type: 'EXPENSE' },
      { category: 'Assinaturas', type: 'EXPENSE' },
      { category: 'Delivery', type: 'EXPENSE' },
      { category: 'Compras', type: 'EXPENSE' },
      { category: 'Contas', type: 'EXPENSE' },
      { category: 'Outros', type: 'EXPENSE' },
      { category: 'Salário', type: 'INCOME' },
      { category: 'Freelance', type: 'INCOME' },
      { category: 'Investimentos', type: 'INCOME' },
      { category: 'Outros', type: 'INCOME' },
    ];
    
    categories.forEach(cat => categoriesSheet.addRow(cat));

    await workbook.xlsx.writeFile(this.getFilePath(month));
  }

  async loadWorkbook(month: string): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(this.getFilePath(month));
    return workbook;
  }

  async saveWorkbook(month: string, workbook: ExcelJS.Workbook): Promise<void> {
    await workbook.xlsx.writeFile(this.getFilePath(month));
  }

  // Transactions
  async getTransactions(month: string): Promise<Transaction[]> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Transactions');
    
    if (!sheet) return [];

    const transactions: Transaction[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      
      const values = row.values as any[];
      if (!values[1]) return; // skip empty rows
      
      transactions.push({
        id: values[1],
        date: values[2],
        type: values[3],
        description: values[4],
        category: values[5],
        subcategory: values[6] || undefined,
        amount: Number(values[7]),
        paymentMethod: values[8],
        isRecurring: values[9] === 'true' || values[9] === true,
        tags: values[10] || undefined,
      });
    });

    return transactions;
  }

  async addTransaction(month: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Transactions');
    
    if (!sheet) throw new Error('Transactions sheet not found');

    const newTransaction: Transaction = {
      id: uuidv4(),
      ...transaction,
    };

    sheet.addRow({
      id: newTransaction.id,
      date: newTransaction.date,
      type: newTransaction.type,
      description: newTransaction.description,
      category: newTransaction.category,
      subcategory: newTransaction.subcategory || '',
      amount: newTransaction.amount,
      paymentMethod: newTransaction.paymentMethod,
      isRecurring: newTransaction.isRecurring,
      tags: newTransaction.tags || '',
    });

    await this.saveWorkbook(month, workbook);
    return newTransaction;
  }

  async updateTransaction(month: string, id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Transactions');
    
    if (!sheet) throw new Error('Transactions sheet not found');

    let updated: Transaction | null = null;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      
      const values = row.values as any[];
      if (values[1] === id) {
        const current: Transaction = {
          id: values[1],
          date: values[2],
          type: values[3],
          description: values[4],
          category: values[5],
          subcategory: values[6],
          amount: Number(values[7]),
          paymentMethod: values[8],
          isRecurring: values[9] === 'true' || values[9] === true,
          tags: values[10],
        };

        updated = { ...current, ...updates, id };

        row.values = [
          null, // Excel rows are 1-indexed
          updated.id,
          updated.date,
          updated.type,
          updated.description,
          updated.category,
          updated.subcategory || '',
          updated.amount,
          updated.paymentMethod,
          updated.isRecurring,
          updated.tags || '',
        ];
      }
    });

    if (!updated) throw new Error('Transaction not found');

    await this.saveWorkbook(month, workbook);
    return updated;
  }

  async deleteTransaction(month: string, id: string): Promise<void> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Transactions');
    
    if (!sheet) throw new Error('Transactions sheet not found');

    let rowToDelete: number | null = null;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = row.values as any[];
      if (values[1] === id) {
        rowToDelete = rowNumber;
      }
    });

    if (rowToDelete) {
      sheet.spliceRows(rowToDelete, 1);
      await this.saveWorkbook(month, workbook);
    } else {
      throw new Error('Transaction not found');
    }
  }

  // Investments
  async getInvestments(month: string): Promise<Investment[]> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Investments');
    
    if (!sheet) return [];

    const investments: Investment[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      
      const values = row.values as any[];
      if (!values[1]) return;
      
      investments.push({
        id: values[1],
        date: values[2],
        investmentType: values[3],
        broker: values[4] || undefined,
        description: values[5],
        amountApplied: Number(values[6]),
        currentValue: values[7] ? Number(values[7]) : undefined,
        notes: values[8] || undefined,
      });
    });

    return investments;
  }

  async addInvestment(month: string, investment: Omit<Investment, 'id'>): Promise<Investment> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Investments');
    
    if (!sheet) throw new Error('Investments sheet not found');

    const newInvestment: Investment = {
      id: uuidv4(),
      ...investment,
    };

    sheet.addRow({
      id: newInvestment.id,
      date: newInvestment.date,
      investmentType: newInvestment.investmentType,
      broker: newInvestment.broker || '',
      description: newInvestment.description,
      amountApplied: newInvestment.amountApplied,
      currentValue: newInvestment.currentValue || '',
      notes: newInvestment.notes || '',
    });

    await this.saveWorkbook(month, workbook);
    return newInvestment;
  }

  async updateInvestment(month: string, id: string, updates: Partial<Investment>): Promise<Investment> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Investments');
    
    if (!sheet) throw new Error('Investments sheet not found');

    let updated: Investment | null = null;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      
      const values = row.values as any[];
      if (values[1] === id) {
        const current: Investment = {
          id: values[1],
          date: values[2],
          investmentType: values[3],
          broker: values[4],
          description: values[5],
          amountApplied: Number(values[6]),
          currentValue: values[7] ? Number(values[7]) : undefined,
          notes: values[8],
        };

        updated = { ...current, ...updates, id };

        row.values = [
          null,
          updated.id,
          updated.date,
          updated.investmentType,
          updated.broker || '',
          updated.description,
          updated.amountApplied,
          updated.currentValue || '',
          updated.notes || '',
        ];
      }
    });

    if (!updated) throw new Error('Investment not found');

    await this.saveWorkbook(month, workbook);
    return updated;
  }

  async deleteInvestment(month: string, id: string): Promise<void> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Investments');
    
    if (!sheet) throw new Error('Investments sheet not found');

    let rowToDelete: number | null = null;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = row.values as any[];
      if (values[1] === id) {
        rowToDelete = rowNumber;
      }
    });

    if (rowToDelete) {
      sheet.spliceRows(rowToDelete, 1);
      await this.saveWorkbook(month, workbook);
    } else {
      throw new Error('Investment not found');
    }
  }

  // Settings
  async getSettings(month: string): Promise<Settings> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Settings');
    
    if (!sheet) return {};

    const settings: any = {};

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = row.values as any[];
      const key = values[1];
      const value = values[2];

      if (key === 'monthlyIncomeGoal' || key === 'monthlySavingsGoal') {
        settings[key] = value ? Number(value) : undefined;
      } else if (key === 'categoryLimits') {
        settings[key] = value || '{}';
      }
    });

    return settings;
  }

  async updateSettings(month: string, settings: Settings): Promise<Settings> {
    const workbook = await this.loadWorkbook(month);
    const sheet = workbook.getWorksheet('Settings');
    
    if (!sheet) throw new Error('Settings sheet not found');

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = row.values as any[];
      const key = values[1];

      if (key in settings) {
        row.values = [null, key, (settings as any)[key]];
      }
    });

    await this.saveWorkbook(month, workbook);
    return settings;
  }
}
