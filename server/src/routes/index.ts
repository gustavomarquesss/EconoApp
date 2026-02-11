import { Router } from 'express';
import { MonthController } from '../controllers/MonthController.js';
import { TransactionController } from '../controllers/TransactionController.js';
import { InvestmentController } from '../controllers/InvestmentController.js';

const router = Router();

const monthController = new MonthController();
const transactionController = new TransactionController();
const investmentController = new InvestmentController();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Months
router.get('/months', monthController.listMonths);
router.post('/months/ensure-current', monthController.ensureCurrentMonth);
router.get('/months/:month/summary', monthController.getMonthSummary);
router.get('/months/:month/insights', monthController.getInsights);

// Transactions
router.get('/months/:month/transactions', transactionController.getTransactions);
router.post('/months/:month/transactions', transactionController.createTransaction);
router.put('/months/:month/transactions/:id', transactionController.updateTransaction);
router.delete('/months/:month/transactions/:id', transactionController.deleteTransaction);

// Investments
router.get('/months/:month/investments', investmentController.getInvestments);
router.post('/months/:month/investments', investmentController.createInvestment);
router.put('/months/:month/investments/:id', investmentController.updateInvestment);
router.delete('/months/:month/investments/:id', investmentController.deleteInvestment);

export default router;
