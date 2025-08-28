import React, { useRef, useState } from "react";
import { useAppContext, useTotalGastosProgramados } from "../../context/AppContext";
import {
  Cartao,
  CartaoCabecalho,
  CartaoCorpo,
  Descricao,
} from "../Cartao";
import Botao from "../Botao";
import ModalGastosProgramados, { ModalGastosProgramadosHandle } from "../ModalGastosProgramados";
import { IGastoProgramado } from "../../types";
import styled from "styled-components";

const GastosProgramadosCard = styled(Cartao)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const GastosProgramadosCorpo = styled(CartaoCorpo)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GastosList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;

const GastoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
  padding: 8px;
  background-color: rgba(255,255,255,0.05);
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255,255,255,0.08);
  }
`;

const GastoInfo = styled.div`
  flex: 1;
`;

const GastoNome = styled.div`
  font-weight: bold;
`;

const GastoDetalhes = styled.div`
  font-size: 12px;
  color: #aaa;
`;

const GastoValor = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const GastoAcoes = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const GastosProgramados = () => {
  const { gastosProgramados, criarGastoProgramado, atualizarGastoProgramado, excluirGastoProgramado } = useAppContext();
  const total = useTotalGastosProgramados();
  const modalRef = useRef<ModalGastosProgramadosHandle>(null);
  const [gastoParaEditar, setGastoParaEditar] = useState<IGastoProgramado | null>(null);

  const handleAdicionar = () => {
    setGastoParaEditar(null);
    modalRef.current?.open();
  };

  const handleEditar = (gasto: IGastoProgramado) => {
    setGastoParaEditar(gasto);
    modalRef.current?.open();
  };

  const handleExcluir = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este gasto programado?")) {
      await excluirGastoProgramado(id);
    }
  };

  const handleSalvar = async (gastoData: Omit<IGastoProgramado, "id" | "userId">) => {
    if (gastoParaEditar) {
      await atualizarGastoProgramado(gastoParaEditar.id, gastoData);
    } else {
      await criarGastoProgramado(gastoData as Omit<IGastoProgramado, "id">);
    }
  };

  const gastosAtivos = gastosProgramados.filter(gasto => gasto.ativo);

  return (
    <>
      <GastosProgramadosCard>
        <CartaoCabecalho>
          Gastos Programados
          <Botao 
            $variante="primario" 
            onClick={handleAdicionar}
            style={{ 
              marginLeft: "auto", 
              fontSize: "12px", 
              padding: "4px 8px",
              minWidth: "auto"
            }}
          >
            +
          </Botao>
        </CartaoCabecalho>
        <GastosProgramadosCorpo>
          <div>
            <Descricao>{formatador.format(total)}</Descricao>
            {gastosAtivos.length > 0 ? (
              <GastosList>
                {gastosAtivos.map((gasto) => (
                  <GastoItem key={gasto.id}>
                    <GastoInfo>
                      <GastoNome>{gasto.nome}</GastoNome>
                      <GastoDetalhes>
                        {gasto.categoria} • Vence dia {gasto.dataVencimento} ({gasto.recorrencia})
                      </GastoDetalhes>
                    </GastoInfo>
                    <GastoAcoes>
                      <GastoValor>{formatador.format(gasto.valor)}</GastoValor>
                      <Botao 
                        $variante="secundario" 
                        onClick={() => handleEditar(gasto)}
                        style={{ fontSize: "10px", padding: "2px 6px", minWidth: "auto" }}
                      >
                        ✏️
                      </Botao>
                      <Botao 
                        $variante="secundario" 
                        onClick={() => handleExcluir(gasto.id)}
                        style={{ fontSize: "10px", padding: "2px 6px", minWidth: "auto" }}
                      >
                        🗑️
                      </Botao>
                    </GastoAcoes>
                  </GastoItem>
                ))}
              </GastosList>
            ) : (
              <div style={{ 
                textAlign: "center", 
                color: "#aaa", 
                marginTop: "16px",
                fontSize: "14px"
              }}>
                Nenhum gasto programado
              </div>
            )}
          </div>
        </GastosProgramadosCorpo>
      </GastosProgramadosCard>

      <ModalGastosProgramados
        ref={modalRef}
        gastoParaEditar={gastoParaEditar}
        aoSalvar={handleSalvar}
      />
    </>
  );
};

export default GastosProgramados; 