import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAppStore } from '../../stores/useAppStore';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const Months: React.FC = () => {
  const { months, currentMonth, setCurrentMonth, isLoading } = useAppStore();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const handleMonthClick = async (month: string) => {
    if (month !== currentMonth) {
      await setCurrentMonth(month);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Histórico de Meses
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Navegue pelos meses anteriores e visualize o histórico financeiro.
      </Typography>

      {months.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Nenhum mês disponível ainda.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {months.map((month) => (
            <Grid item xs={12} sm={6} md={4} key={month.month}>
              <Card
                sx={{
                  height: '100%',
                  border: month.month === currentMonth ? 2 : 0,
                  borderColor: 'primary.main',
                  position: 'relative',
                }}
              >
                <CardActionArea onClick={() => handleMonthClick(month.month)}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {format(parseISO(month.month + '-01'), 'MMMM yyyy', { locale: ptBR })}
                      </Typography>
                      {month.isCurrent && (
                        <Chip
                          label="Atual"
                          color="primary"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      )}
                    </Box>

                    {month.summary ? (
                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="textSecondary">
                            Receitas:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                            {formatCurrency(month.summary.totalIncome)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="textSecondary">
                            Despesas:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                            {formatCurrency(month.summary.totalExpenses)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Saldo:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: month.summary.balance >= 0 ? 'success.main' : 'error.main',
                            }}
                          >
                            {formatCurrency(month.summary.balance)}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Clique para visualizar
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {currentMonth && (
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'info.50' }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Nota:</strong> Ao virar o mês, o sistema cria automaticamente um novo arquivo Excel para o mês atual. 
            Os meses anteriores ficam salvos e podem ser consultados a qualquer momento.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
