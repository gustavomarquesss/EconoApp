import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppStore } from '../../stores/useAppStore';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: 2,
            p: 1,
            color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { summary, transactions, isLoadingSummary, isLoadingTransactions } = useAppStore();

  if (isLoadingSummary || isLoadingTransactions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!summary) {
    return (
      <Box>
        <Typography>Nenhum dado disponível</Typography>
      </Box>
    );
  }

  // Prepare data for charts
  const categoryData = summary.topCategories.map((cat) => ({
    name: cat.category,
    value: cat.amount,
    percentage: cat.percentage,
  }));

  // Group transactions by day for line chart
  const transactionsByDay = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const day = format(parseISO(t.date), 'dd/MM');
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const dailyData = Object.entries(transactionsByDay)
    .map(([day, amount]) => ({ day, amount }))
    .sort((a, b) => {
      const [dayA, monthA] = a.day.split('/').map(Number);
      const [dayB, monthB] = b.day.split('/').map(Number);
      return monthA !== monthB ? monthA - monthB : dayA - dayB;
    });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Receitas"
            value={formatCurrency(summary.totalIncome)}
            icon={<TrendingUp />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Despesas"
            value={formatCurrency(summary.totalExpenses)}
            icon={<TrendingDown />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Saldo"
            value={formatCurrency(summary.balance)}
            icon={<AccountBalance />}
            color={summary.balance >= 0 ? '#2196f3' : '#ff9800'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Economia"
            value={formatCurrency(summary.savings)}
            icon={<Savings />}
            color="#9c27b0"
            subtitle={`${summary.transactionCount} transações`}
          />
        </Grid>

        {/* Category Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Gastos por Categoria
            </Typography>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="90%">
                <Typography color="textSecondary">Sem dados de categorias</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Daily Expenses Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Gastos Diários
            </Typography>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Gastos"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="90%">
                <Typography color="textSecondary">Sem dados de gastos diários</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Top Categories Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Para Onde Vai o Dinheiro
            </Typography>
            <Box sx={{ mt: 2 }}>
              {summary.topCategories.map((cat, index) => (
                <Box
                  key={cat.category}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: index < summary.topCategories.length - 1 ? '1px solid #eee' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <Typography variant="body1">{cat.category}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(cat.amount)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {cat.percentage.toFixed(1)}% do total
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
