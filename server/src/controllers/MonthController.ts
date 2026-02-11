import { Request, Response } from 'express';
import { MonthService } from '../services/MonthService.js';
import { InsightsService } from '../services/InsightsService.js';
import { ExcelRepository } from '../repositories/ExcelRepository.js';

export class MonthController {
  private monthService: MonthService;
  private insightsService: InsightsService;
  private repository: ExcelRepository;

  constructor() {
    this.monthService = new MonthService();
    this.insightsService = new InsightsService();
    this.repository = new ExcelRepository();
  }

  listMonths = async (_req: Request, res: Response) => {
    try {
      const months = await this.monthService.listMonths();
      res.json(months);
    } catch (error) {
      console.error('Error listing months:', error);
      res.status(500).json({ error: 'Failed to list months' });
    }
  };

  ensureCurrentMonth = async (_req: Request, res: Response) => {
    try {
      const currentMonth = await this.monthService.ensureCurrentMonth();
      res.json({ month: currentMonth });
    } catch (error) {
      console.error('Error ensuring current month:', error);
      res.status(500).json({ error: 'Failed to ensure current month' });
    }
  };

  getMonthSummary = async (req: Request, res: Response) => {
    try {
      const { month } = req.params;
      const summary = await this.monthService.getMonthSummary(month);
      res.json(summary);
    } catch (error) {
      console.error('Error getting month summary:', error);
      res.status(500).json({ error: 'Failed to get month summary' });
    }
  };

  getInsights = async (req: Request, res: Response) => {
    try {
      const { month } = req.params;
      const insights = await this.insightsService.generateInsights(month);
      res.json(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  };
}
