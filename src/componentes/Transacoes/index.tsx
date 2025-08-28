import { useRef, useState } from "react";
import MoneyIcon from "../Icones/MoneyIcon";
import Transacao from "../Transacao";
import { Cartao, CartaoCabecalho, CartaoCorpo } from "../Cartao";
import Botao from "../Botao";
import styled from "styled-components";
import ModalTransacao, { ModalTransacaoHandle } from "../ModalTransacao";
import { useAppContext } from "../../context/AppContext";
import { ITransacoes } from "../../types";

export const Container = styled(CartaoCorpo)`
  padding: var(--padding-l) var(--padding-m);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

export const ListaMovimentacoes = styled.ul`
  list-style: none;
  color: var(--cor-primaria);
  margin: 0;
  padding-left: 0px;
  padding-bottom: var(--padding-m);
  width: 100%;
  height: 535px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const Transacoes = () => {
  const modalRef = useRef<ModalTransacaoHandle>(null);
  const { transacoes, criaTransacao, atualizarTransacao, excluirTransacao } = useAppContext();
  const [transacaoParaEditar, setTransacaoParaEditar] = useState<ITransacoes | null>(null);

  const handleAdicionar = () => {
    setTransacaoParaEditar(null);
    modalRef.current?.open();
  };

  const handleEditar = (transacao: ITransacoes) => {
    setTransacaoParaEditar(transacao);
    modalRef.current?.open();
  };

  const handleExcluir = async (id: string) => {
    await excluirTransacao(id);
  };

  const handleSalvar = async (transacaoData: Omit<ITransacoes, "id" | "userId">) => {
    if (transacaoParaEditar) {
      await atualizarTransacao(transacaoParaEditar.id, transacaoData);
    } else {
      await criaTransacao(transacaoData);
    }
  };

  return (
    <Cartao>
      <CartaoCabecalho>Movimentação financeira</CartaoCabecalho>
      <Container>
        <ListaMovimentacoes>
          {transacoes.map((transacao) => (
            <Transacao
              key={transacao.id}
              id={transacao.id}
              tipo={transacao.tipo}
              nome={transacao.nome}
              valor={transacao.valor}
              data={transacao.data}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </ListaMovimentacoes>
        <Botao $variante="neutro" onClick={handleAdicionar}>
          <MoneyIcon />
          Adicionar transação
        </Botao>
        <ModalTransacao
          ref={modalRef}
          transacaoParaEditar={transacaoParaEditar}
          aoSalvar={handleSalvar}
        />
      </Container>
    </Cartao>
  );
};

export default Transacoes;
