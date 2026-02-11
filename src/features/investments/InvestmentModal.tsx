import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateInvestmentSchema, INVESTMENT_TYPE_LABELS } from '../../types/api';
import type { Investment, CreateInvestment } from '../../types/api';
import { useAppStore } from '../../stores/useAppStore';
import { format } from 'date-fns';

interface InvestmentModalProps {
  open: boolean;
  onClose: () => void;
  investment?: Investment | null;
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  open,
  onClose,
  investment,
}) => {
  const { addInvestment, updateInvestment } = useAppStore();
  const isEditing = !!investment;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvestment>({
    resolver: zodResolver(CreateInvestmentSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      investmentType: 'CDB',
      broker: '',
      description: '',
      amountApplied: 0,
      currentValue: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (investment) {
      reset({
        date: investment.date,
        investmentType: investment.investmentType,
        broker: investment.broker || '',
        description: investment.description,
        amountApplied: investment.amountApplied,
        currentValue: investment.currentValue,
        notes: investment.notes || '',
      });
    } else {
      reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        investmentType: 'CDB',
        broker: '',
        description: '',
        amountApplied: 0,
        currentValue: undefined,
        notes: '',
      });
    }
  }, [investment, reset]);

  const onSubmit = async (data: CreateInvestment) => {
    try {
      if (isEditing && investment) {
        await updateInvestment(investment.id, data);
      } else {
        await addInvestment(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save investment:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditing ? 'Editar Investimento' : 'Novo Investimento'}
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
                name="investmentType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tipo de Investimento"
                    select
                    fullWidth
                    error={!!errors.investmentType}
                    helperText={errors.investmentType?.message}
                  >
                    {Object.entries(INVESTMENT_TYPE_LABELS).map(([key, label]) => (
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
                name="broker"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Corretora (opcional)"
                    fullWidth
                    error={!!errors.broker}
                    helperText={errors.broker?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="amountApplied"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor Aplicado"
                    type="number"
                    fullWidth
                    error={!!errors.amountApplied}
                    helperText={errors.amountApplied?.message}
                    inputProps={{ step: '0.01', min: '0' }}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="currentValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor Atual (opcional)"
                    type="number"
                    fullWidth
                    error={!!errors.currentValue}
                    helperText={errors.currentValue?.message}
                    inputProps={{ step: '0.01', min: '0' }}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observações (opcional)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
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
