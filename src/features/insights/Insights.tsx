import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../stores/useAppStore';
import type { Insight } from '../../types/api';

const getInsightIcon = (type: Insight['type']) => {
  switch (type) {
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
    case 'success':
      return <CheckCircleIcon />;
    case 'tip':
      return <LightbulbIcon />;
  }
};

const getInsightSeverity = (type: Insight['type']) => {
  switch (type) {
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    case 'success':
      return 'success';
    case 'tip':
      return 'info';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const Insights: React.FC = () => {
  const { insights, isLoadingInsights } = useAppStore();

  if (isLoadingInsights) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const groupedInsights = {
    warnings: insights.filter((i) => i.type === 'warning'),
    tips: insights.filter((i) => i.type === 'tip'),
    info: insights.filter((i) => i.type === 'info'),
    success: insights.filter((i) => i.type === 'success'),
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Insights e Sugestões
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Análises automáticas baseadas nos seus padrões de gastos e comparações com o mês anterior.
      </Typography>

      {insights.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Nenhum insight disponível no momento. Continue registrando suas transações para receber sugestões personalizadas.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Warnings */}
          {groupedInsights.warnings.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="warning" />
                Atenção
              </Typography>
              <Grid container spacing={2}>
                {groupedInsights.warnings.map((insight) => (
                  <Grid item xs={12} md={6} key={insight.id}>
                    <Alert
                      severity="warning"
                      icon={getInsightIcon(insight.type)}
                      sx={{ height: '100%' }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {insight.description}
                      </Typography>
                      {insight.amount && (
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                          {formatCurrency(Math.abs(insight.amount))}
                        </Typography>
                      )}
                      {insight.category && (
                        <Chip label={insight.category} size="small" sx={{ mt: 1 }} />
                      )}
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Tips */}
          {groupedInsights.tips.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightbulbIcon color="primary" />
                Dicas de Economia
              </Typography>
              <Grid container spacing={2}>
                {groupedInsights.tips.map((insight) => (
                  <Grid item xs={12} md={6} key={insight.id}>
                    <Paper sx={{ p: 3, height: '100%', bgcolor: 'primary.50' }}>
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        <LightbulbIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {insight.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {insight.description}
                          </Typography>
                          {insight.amount && (
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, fontWeight: 'bold', color: 'success.main' }}
                            >
                              Economia potencial: {formatCurrency(insight.amount)}
                            </Typography>
                          )}
                          {insight.category && (
                            <Chip label={insight.category} size="small" sx={{ mt: 1 }} />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Success */}
          {groupedInsights.success.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" />
                Conquistas
              </Typography>
              <Grid container spacing={2}>
                {groupedInsights.success.map((insight) => (
                  <Grid item xs={12} md={6} key={insight.id}>
                    <Alert
                      severity="success"
                      icon={getInsightIcon(insight.type)}
                      sx={{ height: '100%' }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {insight.description}
                      </Typography>
                      {insight.amount && (
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                          {formatCurrency(insight.amount)}
                        </Typography>
                      )}
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Info */}
          {groupedInsights.info.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="info" />
                Informações
              </Typography>
              <Grid container spacing={2}>
                {groupedInsights.info.map((insight) => (
                  <Grid item xs={12} md={6} key={insight.id}>
                    <Alert
                      severity="info"
                      icon={getInsightIcon(insight.type)}
                      sx={{ height: '100%' }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {insight.description}
                      </Typography>
                      {insight.amount && (
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                          {formatCurrency(insight.amount)}
                        </Typography>
                      )}
                      {insight.category && (
                        <Chip label={insight.category} size="small" sx={{ mt: 1 }} />
                      )}
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};
