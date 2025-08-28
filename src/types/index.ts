export interface IUsuario {
  id: string;
  nome: string;
  renda: number;
  orcamentoDiario: number;
}

export interface ITransacoes {
  id: string;
  userId: string;
  nome: string;
  valor: number;
  tipo: "receita" | "despesa";
  categoria: string;
  data: string;
}

export interface IGastoProgramado {
  id: string;
  userId: string;
  nome: string;
  valor: number;
  dataVencimento: string; // dia do mês (1-31)
  recorrencia: "mensal" | "quinzenal" | "semanal";
  categoria: string;
  ativo: boolean;
}
