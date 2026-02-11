import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppStore } from '../../stores/useAppStore';
import { InvestmentModal } from './InvestmentModal';
import { format, parseISO } from 'date-fns';
import type { Investment } from '../../types/api';
import { INVESTMENT_TYPE_LABELS } from '../../types/api';

export const Investments: React.FC = () => {
  const { investments, isLoadingInvestments, deleteInvestment } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const handleAdd = () => {
    setEditingInvestment(null);
    setModalOpen(true);
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este investimento?')) {
      try {
        await deleteInvestment(id);
      } catch (error) {
        console.error('Failed to delete investment:', error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalApplied = investments.reduce((sum, inv) => sum + inv.amountApplied, 0);
  const totalCurrent = investments.reduce(
    (sum, inv) => sum + (inv.currentValue || inv.amountApplied),
    0
  );
  const totalReturn = totalCurrent - totalApplied;
  const returnPercentage = totalApplied > 0 ? (totalReturn / totalApplied) * 100 : 0;

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Data',
      width: 120,
      valueFormatter: (params) => {
        try {
          return format(parseISO(params as string), 'dd/MM/yyyy');
        } catch {
          return params;
        }
      },
    },
    {
      field: 'investmentType',
      headerName: 'Tipo',
      width: 150,
      valueFormatter: (params) => INVESTMENT_TYPE_LABELS[params as keyof typeof INVESTMENT_TYPE_LABELS] || params,
    },
    {
      field: 'description',
      headerName: 'Descrição',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'broker',
      headerName: 'Corretora',
      width: 150,
    },
    {
      field: 'amountApplied',
      headerName: 'Valor Aplicado',
      width: 150,
      valueFormatter: (params) => formatCurrency(params as number),
    },
    {
      field: 'currentValue',
      headerName: 'Valor Atual',
      width: 150,
      valueFormatter: (params) => params ? formatCurrency(params as number) : '-',
    },
    {
      field: 'return',
      headerName: 'Retorno',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const current = params.row.currentValue || params.row.amountApplied;
        const applied = params.row.amountApplied;
        const returnValue = current - applied;
        const returnPercent = applied > 0 ? (returnValue / applied) * 100 : 0;
        
        return (
          <Chip
            label={`${returnPercent >= 0 ? '+' : ''}${returnPercent.toFixed(2)}%`}
            color={returnPercent >= 0 ? 'success' : 'error'}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row as Investment)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Investimentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Novo Investimento
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mb={3}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="textSecondary" variant="body2">
            Total Aplicado
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {formatCurrency(totalApplied)}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="textSecondary" variant="body2">
            Valor Atual
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
            {formatCurrency(totalCurrent)}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="textSecondary" variant="body2">
            Retorno
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: totalReturn >= 0 ? 'success.main' : 'error.main',
            }}
          >
            {formatCurrency(totalReturn)} ({returnPercentage >= 0 ? '+' : ''}
            {returnPercentage.toFixed(2)}%)
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={investments}
          columns={columns}
          loading={isLoadingInvestments}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
            sorting: {
              sortModel: [{ field: 'date', sort: 'desc' }],
            },
          }}
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: 'Nenhum investimento encontrado',
            MuiTablePagination: {
              labelRowsPerPage: 'Linhas por página:',
            },
          }}
        />
      </Paper>

      <InvestmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        investment={editingInvestment}
      />
    </Box>
  );
};
