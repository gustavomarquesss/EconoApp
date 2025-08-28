import axios from "axios";
import { ITransacoes, IUsuario, IGastoProgramado } from "../types";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const obterUsuario = async (): Promise<IUsuario[]> => {
  const { data } = await api.get<IUsuario[]>("/usuarios");
  return data;
};

export const criarUsuario = async (
  usuario: Omit<IUsuario, "id" | "orcamentoDiario">
): Promise<IUsuario> => {
  const usuarioComOrcamentoDiario = {
    ...usuario,
    orcamentoDiario: usuario.renda / 30,
  };

  const { data } = await api.post<IUsuario>(
    "/usuarios",
    usuarioComOrcamentoDiario
  );
  return data;
};

export const atualizarUsuario = async (
  id: string,
  dados: Partial<IUsuario>
): Promise<IUsuario> => {
  const { data } = await api.patch(`/usuarios/${id}`, dados);
  return data;
};

export const obterTransacoes = async (): Promise<ITransacoes[]> => {
  const { data } = await api.get<ITransacoes[]>("/transacoes");
  return data;
};

export const criarTransacao = async (
  transacao: Omit<ITransacoes, "id" | "userId">,
  usuario: Omit<IUsuario, "nome">
): Promise<{ transacao: ITransacoes; novoOrcamentoDiario: number }> => {
  const transacaoComId = { ...transacao, userId: usuario.id };
  const { data } = await api.post<ITransacoes>("/transacoes", transacaoComId);

  const transacoes = await obterTransacoes();
  const saldo = calcularSaldo(transacoes);

  const novoOrcamentoDiario = usuario.renda / 30 + saldo;

  await atualizarUsuario(usuario.id, {
    orcamentoDiario: novoOrcamentoDiario,
  }).catch((error) => console.error(error));

  return { transacao: data, novoOrcamentoDiario };
};

export const atualizarTransacao = async (
  id: string,
  transacao: Partial<ITransacoes>
): Promise<ITransacoes> => {
  const { data } = await api.patch(`/transacoes/${id}`, transacao);
  return data;
};

export const excluirTransacao = async (id: string): Promise<void> => {
  await api.delete(`/transacoes/${id}`);
};

const calcularSaldo = (transacoes: ITransacoes[]): number => {
  return transacoes.reduce((total, transacao) => {
    return transacao.tipo === "receita"
      ? total + transacao.valor
      : total - transacao.valor;
  }, 0);
};

export const obterGastosProgramados = async (): Promise<IGastoProgramado[]> => {
  const { data } = await api.get<IGastoProgramado[]>("/gastosProgramados");
  return data;
};

export const criarGastoProgramado = async (
  gastoProgramado: Omit<IGastoProgramado, "id">
): Promise<IGastoProgramado> => {
  const { data } = await api.post<IGastoProgramado>(
    "/gastosProgramados",
    gastoProgramado
  );
  return data;
};

export const atualizarGastoProgramado = async (
  id: string,
  gastoProgramado: Partial<IGastoProgramado>
): Promise<IGastoProgramado> => {
  const { data } = await api.patch(`/gastosProgramados/${id}`, gastoProgramado);
  return data;
};

export const excluirGastoProgramado = async (id: string): Promise<void> => {
  await api.delete(`/gastosProgramados/${id}`);
};
