import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

export const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Configurações
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          <Typography variant="body1">
            Esta seção está em desenvolvimento. Em breve você poderá configurar:
          </Typography>
          <ul>
            <li>Metas mensais de receita e economia</li>
            <li>Limites por categoria</li>
            <li>Notificações e alertas</li>
            <li>Exportar/importar dados</li>
            <li>Backup automático</li>
          </ul>
        </Alert>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sobre o EconoApp
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Versão 2.0.0
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Sistema de controle financeiro mensal com armazenamento em Excel.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Os dados são salvos localmente em arquivos Excel na pasta <code>server/data/months/</code>.
        </Typography>
      </Paper>
    </Box>
  );
};
