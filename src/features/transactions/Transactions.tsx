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
import { TransactionModal } from './TransactionModal';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '../../types/api';
import { PAYMENT_METHOD_LABELS } from '../../types/api';

export const Transactions: React.FC = () => {
  const { transactions, isLoadingTransactions, deleteTransaction } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAdd = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

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
      field: 'type',
      headerName: 'Tipo',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'INCOME' ? 'Receita' : 'Despesa'}
          color={params.value === 'INCOME' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Descrição',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'category',
      headerName: 'Categoria',
      width: 150,
    },
    {
      field: 'amount',
      headerName: 'Valor',
      width: 130,
      valueFormatter: (params) => formatCurrency(params as number),
    },
    {
      field: 'paymentMethod',
      headerName: 'Método',
      width: 130,
      valueFormatter: (params) => PAYMENT_METHOD_LABELS[params as keyof typeof PAYMENT_METHOD_LABELS] || params,
    },
    {
      field: 'isRecurring',
      headerName: 'Recorrente',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? <Chip label="Sim" size="small" color="info" /> : <Chip label="Não" size="small" variant="outlined" />
      ),
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
            onClick={() => handleEdit(params.row as Transaction)}
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
          Transações
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Nova Transação
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          loading={isLoadingTransactions}
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
            noRowsLabel: 'Nenhuma transação encontrada',
            MuiTablePagination: {
              labelRowsPerPage: 'Linhas por página:',
            },
          }}
        />
      </Paper>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={editingTransaction}
      />
    </Box>
  );
};
