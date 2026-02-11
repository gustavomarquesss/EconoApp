import { Request, Response } from 'express';
import { ExcelRepository } from '../repositories/ExcelRepository.js';
import { CreateTransactionSchema } from '../types/index.js';

export class TransactionController {
  private repository: ExcelRepository;

  constructor() {
    this.repository = new ExcelRepository();
  }

  getTransactions = async (req: Request, res: Response) => {
    try {
      const { month } = req.params;
      const transactions = await this.repository.getTransactions(month);
      res.json(transactions);
    } catch (error) {
      console.error('Error getting transactions:', error);
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  };

  createTransaction = async (req: Request, res: Response) => {
    try {
      const { month } = req.params;
      const validation = CreateTransactionSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid transaction data', details: validation.error });
      }

      const transaction = await this.repository.addTransaction(month, validation.data);
      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  };

  updateTransaction = async (req: Request, res: Response) => {
    try {
      const { month, id } = req.params;
      const transaction = await this.repository.updateTransaction(month, id, req.body);
      res.json(transaction);
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  };

  deleteTransaction = async (req: Request, res: Response) => {
    try {
      const { month, id } = req.params;
      await this.repository.deleteTransaction(month, id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  };
}
