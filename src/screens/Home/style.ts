import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 200px 320px 1fr 320px;
  grid-template-rows: auto auto 1fr;
  gap: var(--gap-s);
  min-width: 1500px;
  margin: 32px auto;
  max-width: 1800px;
  box-sizing: border-box;
  grid-template-areas:
    "sidebar gastos-programados search transacoes"
    "sidebar gastos-programados usuario transacoes"
    "sidebar gastos-programados main-content transacoes";
`;

export const MainContent = styled.section`
  grid-area: main-content;
  display: flex;
  flex-direction: column;
  gap: var(--gap-l);
  justify-content: center;
`;

export const Orcamento = styled.section`
  display: flex;
  justify-content: space-between;
  gap: var(--gap-l);
`;

export const GastosProgramadosWrapper = styled.section`
  grid-area: gastos-programados;
  display: flex;
  flex-direction: column;
`;

export const Movimentacoes = styled.section`
  display: flex;
  gap: var(--gap-l);
`;

export const TransacoesWrapper = styled.section`
  grid-area: transacoes;
  display: flex;
  flex-direction: column;
  gap: var(--gap-l);
`;
