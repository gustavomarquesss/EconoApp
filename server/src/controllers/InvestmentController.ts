import { Request, Response } from 'express';
import { ExcelRepository } from '../repositories/ExcelRepository.js';
import { CreateInvestmentSchema } from '../types/index.js';

export class InvestmentController {
  private repository: ExcelRepository;

  constructor() {
    this.repository = new ExcelRepository();
  }

  getInvestments = async (req: Request, res: Response) => {
    try {
      const { month } = req.params;
      const investments = await this.repository.getInvestments(month);
      res.json(investments);
    } catch (error) {
      console.error('Error getting investments:', error);
      res.status(500).json({ error: 'Failed to get investments' });
    }
  };

  createInvestment = async (req: Request, res: Response) => {
    try {
      const { month } = req.params;
      const validation = CreateInvestmentSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid investment data', details: validation.error });
      }

      const investment = await this.repository.addInvestment(month, validation.data);
      res.status(201).json(investment);
    } catch (error) {
      console.error('Error creating investment:', error);
      res.status(500).json({ error: 'Failed to create investment' });
    }
  };

  updateInvestment = async (req: Request, res: Response) => {
    try {
      const { month, id } = req.params;
      const investment = await this.repository.updateInvestment(month, id, req.body);
      res.json(investment);
    } catch (error) {
      console.error('Error updating investment:', error);
      res.status(500).json({ error: 'Failed to update investment' });
    }
  };

  deleteInvestment = async (req: Request, res: Response) => {
    try {
      const { month, id } = req.params;
      await this.repository.deleteInvestment(month, id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting investment:', error);
      res.status(500).json({ error: 'Failed to delete investment' });
    }
  };
}
