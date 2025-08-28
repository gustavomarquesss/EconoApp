/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { ITransacoes, IUsuario, IGastoProgramado } from "../types";
import {
  criarTransacao,
  criarUsuario,
  obterTransacoes,
  obterUsuario,
  obterGastosProgramados,
  criarGastoProgramado,
  atualizarGastoProgramado,
  excluirGastoProgramado,
  atualizarTransacao,
  excluirTransacao,
} from "../api";

interface AppContextType {
  usuario: IUsuario | null;
  criaUsuario: (
    usuario: Omit<IUsuario, "id" | "orcamentoDiario">
  ) => Promise<void>;
  transacoes: ITransacoes[];
  criaTransacao: (
    novaTransacao: Omit<ITransacoes, "id" | "userId">
  ) => Promise<void>;
  atualizarTransacao: (
    id: string,
    transacao: Partial<ITransacoes>
  ) => Promise<void>;
  excluirTransacao: (id: string) => Promise<void>;
  gastosProgramados: IGastoProgramado[];
  criarGastoProgramado: (
    gastoProgramado: Omit<IGastoProgramado, "id">
  ) => Promise<void>;
  atualizarGastoProgramado: (
    id: string,
    gastoProgramado: Partial<IGastoProgramado>
  ) => Promise<void>;
  excluirGastoProgramado: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [transacoes, setTransacoes] = useState<ITransacoes[]>([]);
  const [gastosProgramados, setGastosProgramados] = useState<IGastoProgramado[]>([]);

  const carregaDadosUsuario = async () => {
    try {
      const usuarios = await obterUsuario();
      const transacoes = await obterTransacoes();
      const gastosProgramados = await obterGastosProgramados();
      if (usuarios.length > 0) {
        setUsuario(usuarios[0]);
        setTransacoes(transacoes);
        setGastosProgramados(gastosProgramados);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    carregaDadosUsuario();
  });

  const criaUsuario = async (
    usuario: Omit<IUsuario, "id" | "orcamentoDiario">
  ) => {
    try {
      const novoUsuario = await criarUsuario(usuario);
      setUsuario(novoUsuario);
    } catch (err) {
      console.log(err);
    }
  };

  const criaTransacao = async (
    novaTransacao: Omit<ITransacoes, "id" | "userId">
  ) => {
    try {
      if (!usuario) {
        throw new Error(
          "Não podemos criar transações sem um usuário associado"
        );
      }
      const { transacao, novoOrcamentoDiario } = await criarTransacao(
        novaTransacao,
        usuario
      );
      setTransacoes((prev) => [...prev, transacao]);
      setUsuario((prev) =>
        prev ? { ...prev, orcamentoDiario: novoOrcamentoDiario } : null
      );
    } catch (err) {
      console.error(err);
    }
  };

  const atualizarTransacaoHandler = async (
    id: string,
    transacao: Partial<ITransacoes>
  ) => {
    try {
      const transacaoAtualizada = await atualizarTransacao(id, transacao);
      setTransacoes((prev) =>
        prev.map((t) => (t.id === id ? transacaoAtualizada : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const excluirTransacaoHandler = async (id: string) => {
    try {
      await excluirTransacao(id);
      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const criarGastoProgramadoHandler = async (
    gastoProgramado: Omit<IGastoProgramado, "id">
  ) => {
    try {
      if (!usuario) {
        throw new Error(
          "Não podemos criar gastos programados sem um usuário associado"
        );
      }
      const novoGastoProgramado = await criarGastoProgramado({
        ...gastoProgramado,
        userId: usuario.id,
      });
      setGastosProgramados((prev) => [...prev, novoGastoProgramado]);
    } catch (err) {
      console.error(err);
    }
  };

  const atualizarGastoProgramadoHandler = async (
    id: string,
    gastoProgramado: Partial<IGastoProgramado>
  ) => {
    try {
      const gastoAtualizado = await atualizarGastoProgramado(id, gastoProgramado);
      setGastosProgramados((prev) =>
        prev.map((gasto) =>
          gasto.id === id ? gastoAtualizado : gasto
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const excluirGastoProgramadoHandler = async (id: string) => {
    try {
      await excluirGastoProgramado(id);
      setGastosProgramados((prev) =>
        prev.filter((gasto) => gasto.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider
      value={{ 
        usuario, 
        criaUsuario, 
        transacoes, 
        criaTransacao,
        atualizarTransacao: atualizarTransacaoHandler,
        excluirTransacao: excluirTransacaoHandler,
        gastosProgramados,
        criarGastoProgramado: criarGastoProgramadoHandler,
        atualizarGastoProgramado: atualizarGastoProgramadoHandler,
        excluirGastoProgramado: excluirGastoProgramadoHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de um Provider");
  }

  return context;
};

export const useTotalGastosMes = () => {
  const { transacoes } = useAppContext();
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  return transacoes
    .filter((transacao) => {
      const dataTransacao = new Date(transacao.data);
      return (
        transacao.tipo === "despesa" &&
        dataTransacao.getMonth() === mesAtual &&
        dataTransacao.getFullYear() === anoAtual
      );
    })
    .reduce((total, transacao) => total + transacao.valor, 0);
};

export const useTotalGastosProgramados = () => {
  const { gastosProgramados } = useAppContext();
  return gastosProgramados
    .filter((gasto) => gasto.ativo)
    .reduce((total, gasto) => total + gasto.valor, 0);
};
