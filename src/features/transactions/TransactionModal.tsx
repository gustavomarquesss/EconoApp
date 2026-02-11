import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTransactionSchema, CATEGORIES, PAYMENT_METHOD_LABELS } from '../../types/api';
import type { Transaction, CreateTransaction } from '../../types/api';
import { useAppStore } from '../../stores/useAppStore';
import { format } from 'date-fns';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  transaction,
}) => {
  const { addTransaction, updateTransaction } = useAppStore();
  const isEditing = !!transaction;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransaction>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'EXPENSE',
      description: '',
      category: '',
      subcategory: '',
      amount: 0,
      paymentMethod: 'PIX',
      isRecurring: false,
      tags: '',
    },
  });

  const transactionType = watch('type');

  useEffect(() => {
    if (transaction) {
      reset({
        date: transaction.date,
        type: transaction.type,
        description: transaction.description,
        category: transaction.category,
        subcategory: transaction.subcategory || '',
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod,
        isRecurring: transaction.isRecurring,
        tags: transaction.tags || '',
      });
    } else {
      reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'EXPENSE',
        description: '',
        category: '',
        subcategory: '',
        amount: 0,
        paymentMethod: 'PIX',
        isRecurring: false,
        tags: '',
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data: CreateTransaction) => {
    try {
      if (isEditing && transaction) {
        await updateTransaction(transaction.id, data);
      } else {
        await addTransaction(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const categories = transactionType === 'INCOME' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditing ? 'Editar Transação' : 'Nova Transação'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data"
                    type="date"
                    fullWidth
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tipo"
                    select
                    fullWidth
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    <MenuItem value="INCOME">Receita</MenuItem>
                    <MenuItem value="EXPENSE">Despesa</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Categoria"
                    select
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="subcategory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Subcategoria (opcional)"
                    fullWidth
                    error={!!errors.subcategory}
                    helperText={errors.subcategory?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor"
                    type="number"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    inputProps={{ step: '0.01', min: '0' }}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Método de Pagamento"
                    select
                    fullWidth
                    error={!!errors.paymentMethod}
                    helperText={errors.paymentMethod?.message}
                  >
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tags (separadas por vírgula)"
                    fullWidth
                    error={!!errors.tags}
                    helperText={errors.tags?.message}
                    placeholder="ex: trabalho, pessoal, urgente"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isRecurring"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Transação recorrente"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
