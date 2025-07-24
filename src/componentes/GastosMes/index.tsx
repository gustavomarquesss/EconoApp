import { useTotalGastosMes } from "../../context/AppContext";
import {
  Cartao,
  CartaoCabecalho,
  CartaoCorpo,
  Descricao,
} from "../Cartao";

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const GastosMes = () => {
  const totalGastos = useTotalGastosMes();

  return (
    <Cartao>
      <CartaoCabecalho>Gastos do mês</CartaoCabecalho>
      <CartaoCorpo>
        <Descricao>{formatador.format(totalGastos)}</Descricao>
      </CartaoCorpo>
    </Cartao>
  );
};

export default GastosMes;
